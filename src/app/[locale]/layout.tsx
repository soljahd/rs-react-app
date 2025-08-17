import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import { ThemeProvider } from '@/providers/themeProvider';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale}>
        <div id="root">
          <div className="app mx-auto flex min-h-screen max-w-5xl min-w-3xl flex-col justify-start gap-8 bg-inherit p-4">
            <Header />
            <main className="flex flex-1">{children}</main>
          </div>
        </div>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
