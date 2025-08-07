export type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publish_year?: number[];
  cover_i?: number;
  edition_count?: number;
  language?: string[];
  subject?: string[];
  isbn?: string[];
  publisher?: string[];
  ratings_average?: number;
  ratings_count?: number;
};

export type Author = {
  name: string;
  key: string;
};

export type BookDescription = string | { type: string; value: string };

export type BookDetails = {
  key: string;
  title: string;
  description?: BookDescription;
  authors?: Author[];
  covers?: number[];
  first_publish_date?: string;
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  created?: {
    type: string;
    value: string;
  };
  last_modified?: {
    type: string;
    value: string;
  };
  latest_revision?: number;
  revision?: number;
  type?: {
    key: string;
  };
  excerpts?: {
    comment?: string;
    author?: {
      key: string;
    };
    excerpt: string;
  }[];
  links?: {
    title: string;
    url: string;
  }[];
};

export type SearchBooksResponse = {
  docs: Book[];
  numFound: number;
  offset?: number;
  q?: string;
};
