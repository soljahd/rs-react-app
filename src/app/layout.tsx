import Header from '@/components/Header';
import { ReduxProvider } from '@/providers/reduxProvider';
import { ThemeProvider } from '@/providers/themeProvider';
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
    <html lang="en">
      <ThemeProvider>
        <ReduxProvider>
          <body>
            <div id="root">
              <div className="app mx-auto flex min-h-screen max-w-5xl min-w-3xl flex-col justify-start gap-8 bg-inherit p-4">
                <Header />
                <main className="flex flex-1">{children}</main>
              </div>
            </div>
          </body>
        </ReduxProvider>
      </ThemeProvider>
    </html>
  );
}
