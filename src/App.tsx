import { Component } from 'react';
import Search from './components/Search';
import Results from './components/Results';

class App extends Component {
  render() {
    return (
      <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-center gap-1 p-4">
        <Search />
        <Results />
      </div>
    );
  }
}

export default App;
