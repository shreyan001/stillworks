import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Stillworks',
  description: 'Open-tool store. Public hashes are written to 0G every 24 hours and posted to the contract by Chainlink CRE.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isExtNoise = function(msg) {
                  return typeof msg === 'string' && (
                    msg.indexOf('Could not establish connection') !== -1 ||
                    msg.indexOf('Receiving end does not exist') !== -1 ||
                    msg.indexOf('message channel closed') !== -1 ||
                    msg.indexOf('Extension context invalidated') !== -1
                  );
                };
                var origAdd = window.addEventListener;
                window.addEventListener = function(type, listener, options) {
                  if (type === 'unhandledrejection' || type === 'error') {
                    var wrapped = function(e) {
                      var msg = e && (e.message || (e.reason && (e.reason.message || String(e.reason))) || '');
                      if (isExtNoise(msg)) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                        return;
                      }
                      return typeof listener === 'function' ? listener.apply(this, arguments) : null;
                    };
                    return origAdd.call(this, type, wrapped, options);
                  }
                  return origAdd.apply(this, arguments);
                };
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
