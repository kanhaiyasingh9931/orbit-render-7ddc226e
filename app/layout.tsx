import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orbit Notes',
  description: 'A clean, fast, and responsive notes application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}