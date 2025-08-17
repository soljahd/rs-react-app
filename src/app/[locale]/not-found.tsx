import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { Link } from '@/i18n/navigation';

function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="mx-auto flex min-h-96 flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800 dark:shadow-gray-700/50">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{t('404')}</h1>

        <p className="text-lg text-gray-600 dark:text-gray-300">{t('404 message')}</p>

        <Link href="/">
          <Button color="primary" size="md">
            {t('return home')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
