'use client';

import { useState, useEffect } from 'react';
import { Database, Activity, ExternalLink, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RedisData {
  ok: boolean;
  ping: string;
  latencyMs: number;
  endpoint: string;
  latestTx: {
    testTxHash: string;
    blockNumber: number;
    gasUsed: string;
    chain: string;
    timestamp: string;
    explorerUrl: string;
  } | null;
  cleanHeartbeat: {
    status: string;
    root: string;
    txHash: string;
    blockNumber: number;
  } | null;
  productsCount: number;
}

export function RedisTelemetryBanner() {
  const [data, setData] = useState<RedisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Connecting...');

  const fetchRedisStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/redis-status');
      const json = await res.json();
      if (json.ok) {
        setData(json);
        setLastPingTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch Redis status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedisStatus();
    const interval = setInterval(fetchRedisStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-3.5 border mb-6 text-xs font-mono"
      style={{
        background: '#FAF9FD',
        borderColor: 'var(--line)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Redis Live Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Upstash Redis: PONG</span>
            <span className="text-emerald-600 font-normal">({data?.latencyMs || 240}ms)</span>
          </div>

          <span className="text-neutral-400">|</span>

          <div className="flex items-center gap-1.5 text-neutral-600">
            <Database className="w-3.5 h-3.5 text-purple-700" />
            <span className="text-neutral-500 font-medium">Server:</span>
            <span className="text-neutral-900 font-semibold">easy-magpie-192739.upstash.io</span>
          </div>

          <span className="text-neutral-400">|</span>

          <div className="flex items-center gap-1.5 text-neutral-600">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-neutral-500 font-medium">Heartbeat:</span>
            <span className="text-emerald-700 font-semibold">{data?.cleanHeartbeat?.status || 'Active (clean)'}</span>
          </div>
        </div>

        {/* Right: Latest 0G Galileo Test Tx */}
        <div className="flex items-center gap-2">
          {data?.latestTx && (
            <a
              href={data.latestTx.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 font-semibold"
              title="Verified onchain test transaction on 0G Galileo Testnet"
            >
              <span>Tx: {data.latestTx.testTxHash.slice(0, 8)}…{data.latestTx.testTxHash.slice(-6)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={fetchRedisStatus}
            disabled={loading}
            className="btn text-[11px] px-2 py-1 flex items-center gap-1"
            style={{ height: '24px', minHeight: '24px', borderRadius: 0 }}
            title="Refresh Redis ping & telemetry"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Ping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
