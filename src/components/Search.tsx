import { Component } from 'react';

class Search extends Component {
  render() {
    return (
      <div className="search flex gap-4">
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
        />
        <button
          type="button"
          className="min-w-24 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 active:bg-blue-700"
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
