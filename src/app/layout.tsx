import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RPG Item Creator',
  description:
    'A web-based tool built with Next.js, Tailwind CSS and TypeScript that lets you generate RPG-style items easily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
