import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <h2 className="text-2xl font-bold text-white">404 - Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The requested resource could not be found on Stillworks.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-zerog-purple hover:bg-zerog-purpleDark text-white font-semibold text-xs rounded-lg transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
