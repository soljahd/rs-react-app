'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Button from './Button';

function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const otherLocale = currentLocale === 'en' ? 'ru' : 'en';

  const switchLocale = () => {
    const segments = pathname.split('/');
    segments[1] = otherLocale;
    const newPath = segments.join('/');

    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${newPath}?${queryString}` : newPath;

    router.push(finalUrl);
  };

  return (
    <Button size="sm" onClick={switchLocale}>
      {otherLocale.toUpperCase()}
    </Button>
  );
}

export default LocaleSwitcher;
