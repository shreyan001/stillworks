import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Stillworks | Sovereign Software Commerce on 0G',
  description: 'Neutral escrow rails, TEE-audited passports, and automated walkaway guarantees powered by 0G Chain, 0G Storage, and 0G Compute.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zerog-darkBg text-slate-100 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-zerog-border py-6 text-center text-xs text-slate-500">
            Stillworks — ETHGlobal Mumbai 2026. Built with 0G Galileo (16602) & 0G Storage Turbo.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
