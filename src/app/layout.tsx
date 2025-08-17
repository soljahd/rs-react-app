import { ReduxProvider } from '@/providers/reduxProvider';
import type { Metadata } from 'next';
import './index.css';

export const metadata: Metadata = {
  title: 'RS React APP',
  description: 'RS React APP description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html>
        <body>{children}</body>
      </html>
    </ReduxProvider>
  );
}
