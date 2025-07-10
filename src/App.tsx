import { Component } from 'react';
import { searchBooks, type Book } from './api/api';
import Search from './components/Search';
import Results from './components/Results';

type State = {
  isLoading: boolean;
  error: string | null;
  initialQuery: string;
  results: Book[];
};

class App extends Component<unknown, State> {
  state: State = {
    isLoading: true,
    error: null,
    initialQuery: localStorage.getItem('searchQuery') || '',
    results: [],
  };

  componentDidMount() {
    void this.searchData();
  }

  async searchData(query: string = this.state.initialQuery) {
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

  render() {
    return (
      <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-start gap-8 p-4 pt-16">
        <Search initialValue={this.state.initialQuery} onSearch={this.handleSearch} />
        <Results loading={this.state.isLoading} error={this.state.error} books={this.state.results} />
      </div>
    );
  }
}

export default App;
