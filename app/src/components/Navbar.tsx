'use client';

import Link from 'next/link';
import { WalletButton } from './WalletButton';
import { ShieldCheck, Database, Cpu, Activity } from 'lucide-react';

export function Navbar() {
  return (
    <header className="border-b border-zerog-border bg-zerog-cardBg/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zerog-purple to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">Stillworks</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zerog-purple/20 text-zerog-purple border border-zerog-purple/30">
                0G Galileo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Sovereign Software Commerce & CROPS Escrow</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://chainscan-galileo.0g.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-zerog-purple transition-colors flex items-center gap-1 hidden md:flex"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chain ID: 16602</span>
          </a>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
