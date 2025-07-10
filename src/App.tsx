import { Component } from 'react';
import Search from './components/Search';
import Results from './components/Results';

type State = {
  searchQuery: string;
};

class App extends Component<unknown, State> {
  state: State = {
    searchQuery: localStorage.getItem('searchQuery') || '',
  };

  handleSearch = (query: string) => {
    localStorage.setItem('searchQuery', query);
    this.setState({ searchQuery: query }, () => {
      console.log(query);
    });
  };

  render() {
    return (
      <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-center gap-1 p-4">
        <Search initialValue={this.state.searchQuery} onSearch={this.handleSearch} />
        <Results />
      </div>
    );
  }
}

export default App;
