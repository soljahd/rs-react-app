'use client';

import { useTranslations } from 'next-intl';
import { useBookDetails } from '@/app/[locale]/main/layout';
import Button from './Button';
import Spinner from './Spinner';
import type { ReactNode } from 'react';

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations('details');
  return (
    <button
      onClick={onClose}
      className="rounded-full p-2 hover:cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600"
      aria-label={t('close')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
};

const DetailsHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
    <CloseButton onClose={onClose} />
  </div>
);

const DetailSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-lg font-semibold dark:text-gray-200">{title}</h3>
    {children}
  </div>
);

const TagList = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, index) => (
      <span key={index} className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700 dark:text-gray-200">
        {tag}
      </span>
    ))}
  </div>
);

function ResultsDetails() {
  const { bookDetails, loading, onClose, bookId, onRefresh } = useBookDetails();
  const t = useTranslations('details');

  if (!bookDetails) return null;

  const getDescription = () => {
    if (!bookDetails.description) return t('noDescription');
    if (typeof bookDetails.description === 'string') return bookDetails.description;
    return bookDetails.description.value || t('noDescription');
  };

  if (!bookId) return null;

  return (
    <div className="flex w-1/2 flex-col gap-6 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <Button type="button" loading={loading} className="min-w-24" onClick={onRefresh}>
            {t('refresh')}
          </Button>
          <DetailsHeader title={t('header')} onClose={onClose} />

          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold dark:text-white">{bookDetails.title}</h1>

            <div className="flex flex-col gap-6">
              {bookDetails.authors && (
                <DetailSection title={t('authors')}>
                  <p className="dark:text-gray-300">{bookDetails.authors.map((a) => a.name).join(', ')}</p>
                </DetailSection>
              )}

              {bookDetails.first_publish_date && (
                <DetailSection title={t('firstPublished')}>
                  <p className="dark:text-gray-300">{bookDetails.first_publish_date}</p>
                </DetailSection>
              )}

              <DetailSection title={t('description')}>
                <p className="overflow-hidden overflow-ellipsis whitespace-pre-line dark:text-gray-300">
                  {getDescription()}
                </p>
              </DetailSection>

              {bookDetails.subjects && (
                <DetailSection title={t('subjects')}>
                  <TagList tags={bookDetails.subjects} />
                </DetailSection>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultsDetails;
