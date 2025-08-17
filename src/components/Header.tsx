'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

function Header() {
  const location = usePathname();
  const isMainPage = location.includes('/main');
  const isAboutPage = location.includes('/about');

  const t = useTranslations('Header');

  return (
    <header className="flex items-center justify-between bg-gray-100 px-8 py-4 shadow-md transition-colors duration-200 dark:bg-gray-800">
      <nav className="flex gap-8 font-medium">
        {isMainPage ? (
          <span className="cursor-default text-lg text-gray-700 dark:text-gray-300">{t('main')}</span>
        ) : (
          <Link
            href="/main"
            className="text-lg text-gray-700 underline-offset-4 transition-colors duration-200 hover:text-blue-600 hover:underline dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t('main')}
          </Link>
        )}
        {isAboutPage ? (
          <span className="cursor-default text-lg text-gray-700 dark:text-gray-300">{t('about')}</span>
        ) : (
          <Link
            href="/about"
            className="text-lg text-gray-700 underline-offset-4 transition-colors duration-200 hover:text-blue-600 hover:underline dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t('about')}
          </Link>
        )}
      </nav>
      <div className="flex gap-6">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </header>
  );
}

export default Header;
