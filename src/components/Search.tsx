import { Component } from 'react';
import Button from './Button';
import type { ChangeEvent, FormEvent } from 'react';

type Props = {
  loading: boolean;
  initialValue: string;
  onSearch: (qery: string) => Promise<void>;
};

type State = {
  searchQuery: string;
};

class Search extends Component<Props, State> {
  state = {
    searchQuery: this.props.initialValue,
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  submitSearchRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await this.props.onSearch(this.state.searchQuery.trim());
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    this.submitSearchRequest(event).catch(() => {});
  };

  render() {
    const { loading } = this.props;
    const { searchQuery } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="search flex gap-4" role="search">
        <input
          aria-label="Search"
          aria-busy={loading}
          disabled={loading}
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
          value={searchQuery}
          placeholder="Enter book title or author..."
          onChange={this.handleChange}
        />
        <Button type="submit" loading={loading}>
          Search
        </Button>
      </form>
    );
  }
}

export default Search;
