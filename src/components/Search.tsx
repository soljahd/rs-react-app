import { Component, type ChangeEvent } from 'react';

type Props = {
  initialValue: string;
  onSearch: (qery: string) => void;
};

type State = {
  searchQuery: string;
};

class Search extends Component<Props, State> {
  state = { searchQuery: this.props.initialValue };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSubmit = () => {
    this.props.onSearch(this.state.searchQuery.trim());
  };

  render() {
    return (
      <div className="search flex gap-4">
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
          value={this.state.searchQuery}
          onChange={this.handleChange}
        />
        <button
          type="button"
          className="min-w-24 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 active:bg-blue-700"
          onClick={this.handleSubmit}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
