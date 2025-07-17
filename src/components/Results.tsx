import { Component } from 'react';
import Spinner from './Spinner';
import type { Book } from '../api/api';
import type { ReactNode } from 'react';

type Props = {
  loading: boolean;
  error: string | null;
  books: Book[];
};

class Results extends Component<Props> {
  renderContainer(children: ReactNode) {
    return (
      <div role="region" className="results flex flex-col justify-center gap-4">
        <h1 className="results_header w-full text-center text-3xl">Results</h1>
        {children}
      </div>
    );
  }

  renderLoading() {
    return <Spinner size="xl" />;
  }

  renderError() {
    return (
      <div role="alert" className="results_content results_error text-red-500">
        {this.props.error}
      </div>
    );
  }

  renderNoResults() {
    return (
      <p role="status" className="results_content text-gray-500">
        No books found. Try another search.
      </p>
    );
  }

  renderBooks() {
    return (
      <div role="list" aria-label="List of books" className="results_content flex w-full flex-wrap gap-2">
        <div role="presentation" className="results_item flex w-full rounded-lg bg-gray-100 p-2 text-xl">
          <h3 className="results_item-title flex w-1/2 font-medium">Title</h3>
          <h3 className="results_item-description flex w-1/2 font-medium">Description</h3>
        </div>
        {this.props.books.map((book) => this.renderBook(book))}
      </div>
    );
  }

  renderBook(book: Book) {
    return (
      <div
        role="article"
        aria-label="Books"
        className="results_item flex w-full rounded-lg border border-gray-200 p-2 text-xl hover:bg-gray-50"
        key={book.key}
      >
        <div className="flex w-1/2 items-center font-medium">{book.title}</div>
        <div className="flex w-1/2 items-center text-gray-600">
          <ul className="flex flex-col gap-1">
            <li className="flex gap-2">
              <span className="font-semibold">Author:</span>
              <span>{book.author_name?.join(', ') || 'Unknown author'}</span>
            </li>
            {book.first_publish_year && (
              <li className="flex gap-2">
                <span className="font-semibold">First published:</span>
                <span>{book.first_publish_year}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const { loading, error, books } = this.props;

    if (loading) return this.renderContainer(this.renderLoading());
    if (error) return this.renderContainer(this.renderError());
    if (books.length === 0) return this.renderContainer(this.renderNoResults());

    return this.renderContainer(this.renderBooks());
  }
}

export default Results;
