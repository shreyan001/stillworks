'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from './WalletButton';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Stage board' },
    { href: '/app', label: 'Explore / Launches' },
    { href: '/leaderboard', label: 'Registry' },
    { href: '/proposals', label: 'Reward Hub' },
    { href: '/console', label: 'Maker console' },
  ];

  return (
    <div className="wrap" style={{ paddingBottom: 0 }}>
      <nav className="nav-bar" aria-label="Main Navigation">
        <Link href="/" className="logo-brand flex items-center">
          <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" className="mr-2">
            <rect x="0.5" y="0.5" width="13" height="13" fill="none" stroke="#6D28D9" strokeWidth="1" />
            <circle cx="7" cy="7" r="2.5" fill="#6D28D9" />
          </svg>
          Stillworks
        </Link>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive ? 'var(--p)' : 'var(--ink)',
                background: isActive ? 'var(--pt)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
        <span className="f" />
        <WalletButton />
        <Link
          href="/launch"
          className="btn p"
          style={{
            height: '60px',
            borderRadius: 0,
            border: 0,
            padding: '0 28px',
          }}
        >
          Launch software
        </Link>
      </nav>
    </div>
  );
}
