import { readFileSync } from "node:fs";

const expected = "0x237eA22D38a1e20EC50b39711014B9C87dBb21c7";
const rpc = "https://evmrpc-testnet.0g.ai";

function envNamePresent(name) {
  const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
  return text.split(/\r?\n/).some((line) => line.startsWith(`${name}=`) && line.slice(name.length + 1).trim().length > 0);
}

function envValue(name) {
  const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, "") : "";
}

async function rpcCall(method, params) {
  const response = await fetch(rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = await response.json();
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

const chainId = await rpcCall("eth_chainId", []);
const balance = await rpcCall("eth_getBalance", [expected, "latest"]);
const publicAddress = envValue("PUBLIC_ADDRESS");
const storagePkg = JSON.parse(readFileSync(new URL("./node_modules/@0gfoundation/0g-storage-ts-sdk/package.json", import.meta.url), "utf8"));
const computePkg = JSON.parse(readFileSync(new URL("./node_modules/@0gfoundation/0g-compute-ts-sdk/package.json", import.meta.url), "utf8"));
const ethersPkg = JSON.parse(readFileSync(new URL("./node_modules/ethers/package.json", import.meta.url), "utf8"));
await import("@0gfoundation/0g-storage-ts-sdk");
await import("ethers");

console.log(
  JSON.stringify(
    {
      chainIdHex: chainId,
      chainId: Number(chainId),
      balanceWei: BigInt(balance).toString(),
      publicAddressMatch: publicAddress.toLowerCase() === expected.toLowerCase(),
      hasPrivateKey: envNamePresent("PRIVATE_KEY"),
      hasDeployerPrivateKey: envNamePresent("DEPLOYER_PRIVATE_KEY"),
      storageSdk: storagePkg.version,
      computeSdk: computePkg.version,
      ethers: ethersPkg.version,
    },
    null,
    2,
  ),
);
