import { Component } from 'react';
import { searchBooks } from './api/api';
import { Button, Results, Search } from './components';
import type { Book } from './api/api';

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
        <div className="top-controls">
          <Search loading={isLoading} initialValue={initialQuery} onSearch={this.handleSearch} />
        </div>
        <div className="results min-h-96">
          <Results loading={isLoading} error={error} books={results} />
        </div>
        <div className="error-button flex justify-end">
          <Button color="error" onClick={this.throwError}>
            Throw Error
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
