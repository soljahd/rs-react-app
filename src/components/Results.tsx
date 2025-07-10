import { Component } from 'react';
import { type Book } from '../api/api';
import Spinner from './Spinner';

type Props = {
  loading: boolean;
  error: string | null;
  books: Book[];
};

class Results extends Component<Props> {
  renderContainer(children: React.ReactNode) {
    return (
      <div className="results flex flex-col justify-center gap-4">
        <h1 className="results_header w-full text-3xl">Results</h1>
        {children}
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="results_content loading-spinner">
        <Spinner />
      </div>
    );
  }

  renderError() {
    return <div className="results_content results_error text-red-500">{this.props.error}</div>;
  }

  renderNoResults() {
    return <p className="results_content text-gray-500">No books found. Try another search.</p>;
  }

  renderBooks() {
    return (
      <div className="results_content flex w-full flex-wrap gap-2">
        {this.props.books.map((book) => (
          <div className="results_item flex w-full rounded-lg border border-gray-300 p-2 text-xl" key={book.key}>
            <h3 className="results_item-title flex w-1/2 font-medium">{book.title}</h3>
            <p className="results_item-description flex w-1/2 text-gray-600">
              {book.author_name?.join(', ') || 'Unknown author'}
            </p>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { loading, error, books } = this.props;

    if (loading) return this.renderContainer(this.renderLoading());
    if (error) return this.renderContainer(this.renderError());
    if (books.length === 0) this.renderContainer(this.renderNoResults());

    return this.renderContainer(this.renderBooks());
  }
}

export default Results;
