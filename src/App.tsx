import { Component } from 'react';
import { searchBooks, type Book } from './api/api';
import Search from './components/Search';
import Results from './components/Results';

type State = {
  isLoading: boolean;
  error: string | null;
  initialQuery: string;
  results: Book[];
  shouldThrowError: boolean;
};

class App extends Component<unknown, State> {
  state = {
    isLoading: true,
    error: null,
    initialQuery: localStorage.getItem('searchQuery') || '',
    results: [],
    shouldThrowError: false,
  };

  componentDidMount() {
    void this.searchData(this.state.initialQuery);
  }

  async searchData(query: string) {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await searchBooks(query);
      this.setState({ results: response.docs, isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        this.setState({ isLoading: false, error: error.message });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  }

  handleSearch = async (query: string) => {
    localStorage.setItem('searchQuery', query);
    await this.searchData(query);
  };

  throwError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    const { isLoading, error, initialQuery, results, shouldThrowError } = this.state;
    if (shouldThrowError) {
      throw new Error('This is a test error from the error button!');
    }
    return (
      <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-start gap-8 p-4 pt-16">
        <Search initialValue={initialQuery} onSearch={this.handleSearch} />
        <Results loading={isLoading} error={error} books={results} />
        <button
          type="button"
          className="max-w-32 min-w-24 cursor-pointer rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 active:bg-blue-700 disabled:cursor-auto disabled:bg-gray-500"
          onClick={this.throwError}
        >
          Throw Error
        </button>
      </div>
    );
  }
}

export default App;
