import {
  workflow,
  handler,
  HTTPClient,
  EVMClient,
  consensusIdenticalAggregation,
  type Runtime,
  type HTTPSendRequester,
} from "@chainlink/cre-sdk";
import { encodeAbiParameters, parseAbiParameters, keccak256, toHex } from "viem";
import { z } from "zod";

// 1. Configuration & Health Schema definitions
const configSchema = z.object({
  healthCheckUrl: z.string().url(),
  chainSelector: z.string(),
  consumerContractAddress: z.string(),
});
type Config = z.infer<typeof configSchema>;

interface HealthResponse {
  status: string;
  timestamp: number;
  components: {
    ruleEngine: boolean;
    identityVerification: boolean;
    storageService: boolean;
  };
}

// 2. Pure TypeScript Merkle Root Builder (WASM compatible)
function computeMerkleRoot(leaves: `0x${string}`[]): `0x${string}` {
  if (leaves.length === 0) return keccak256(toHex(""));
  let currentLevel = [...leaves];
  while (currentLevel.length > 1) {
    const nextLevel: `0x${string}`[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1];
        const combined = left < right ? left + right.slice(2) : right + left.slice(2);
        nextLevel.push(keccak256(combined as `0x${string}`));
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

// 3. Independent DON node HTTP fetcher
const fetchHealthz = (requester: HTTPSendRequester, url: string): HealthResponse => {
  const res = requester.sendRequest({ url, method: "GET" }).result();
  if (res.statusCode !== 200) {
    throw new Error(`Health check failed with status: ${res.statusCode}`);
  }
  return JSON.parse(res.bodyText) as HealthResponse;
};

// 4. Trigger Handler with BFT Consensus & On-chain Write
const onHealthCheckTrigger = (runtime: Runtime<Config>) => {
  runtime.log("Triggered Clean healthz verification workflow");

  const httpClient = new HTTPClient();

  // DON consensus on deterministic health status
  const consensusHealth = httpClient.sendRequest(
    runtime,
    fetchHealthz,
    consensusIdenticalAggregation<HealthResponse>()
  )(runtime.config.healthCheckUrl).result();

  const isHealthy =
    consensusHealth.status === "ok" &&
    consensusHealth.components.ruleEngine &&
    consensusHealth.components.identityVerification &&
    consensusHealth.components.storageService;

  // Build Merkle leaves for health components
  const leaves: `0x${string}`[] = [
    keccak256(toHex(`ruleEngine:${consensusHealth.components.ruleEngine}`)),
    keccak256(toHex(`identityVerification:${consensusHealth.components.identityVerification}`)),
    keccak256(toHex(`storageService:${consensusHealth.components.storageService}`)),
    keccak256(toHex(`timestamp:${consensusHealth.timestamp}`)),
  ];

  const merkleRoot = computeMerkleRoot(leaves);
  runtime.log(`Computed Health Attestation Merkle Root: ${merkleRoot}`);

  // ABI encode attestation payload: (bytes32 merkleRoot, uint64 timestamp, bool isHealthy)
  const encodedPayload = encodeAbiParameters(
    parseAbiParameters("bytes32 merkleRoot, uint64 timestamp, bool isHealthy"),
    [merkleRoot, BigInt(consensusHealth.timestamp), isHealthy]
  );

  // Generate DON-signed report
  const signedReport = runtime.report({ payload: encodedPayload }).result();

  // Write report to 0G Galileo contract
  const evmClient = new EVMClient(BigInt(runtime.config.chainSelector));
  const tx = evmClient.writeReport(runtime, {
    receiver: runtime.config.consumerContractAddress,
    report: signedReport,
    gasConfig: {
      gasLimit: "350000",
    },
  }).result();

  runtime.log(`Attestation submitted to 0G Galileo. Tx Status: ${tx.txStatus}`);
  return "Health check attestation successful";
};

// 5. Workflow Entrypoint
export async function main() {
  const runner = workflow.newRunner<Config>();
  runner.registerHandler(
    handler.cron({ schedule: "*/15 * * * *" }), // Run every 15 min or 24h
    onHealthCheckTrigger
  );
}
