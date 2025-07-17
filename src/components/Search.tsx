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

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await this.props.onSearch(this.state.searchQuery.trim());
  };

  render() {
    return (
      <form onSubmit={(event) => void this.handleSubmit(event)} className="search flex gap-4">
        <input
          aria-label="search"
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
          value={this.state.searchQuery}
          onChange={this.handleChange}
        />
        <Button type="submit" loading={this.props.loading}>
          Search
        </Button>
      </form>
    );
  }
}

export default Search;
