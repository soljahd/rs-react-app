import { Component, type ChangeEvent, type FormEvent } from 'react';

type Props = {
  initialValue: string;
  onSearch: (qery: string) => Promise<void>;
};

type State = {
  searchQuery: string;
  isLoading: boolean;
};

class Search extends Component<Props, State> {
  state = {
    searchQuery: this.props.initialValue,
    isLoading: false,
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    await this.props.onSearch(this.state.searchQuery.trim());
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <form onSubmit={(event) => void this.handleSubmit(event)} className="search flex gap-4">
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
          value={this.state.searchQuery}
          onChange={this.handleChange}
        />
        <button
          type="submit"
          disabled={this.state.isLoading}
          className="min-w-24 cursor-pointer rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 active:bg-blue-700 disabled:cursor-auto disabled:bg-gray-500"
        >
          Search
        </button>
      </form>
    );
  }
}

export default Search;
