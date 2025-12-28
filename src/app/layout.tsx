import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DR AFNIZANFAIZAL | Strategic AI Ecosystem Specialist',
  description: 'Inspiring future through advanced AI solutions, from predictive analytics to autonomous systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
