import { Component } from 'react';

class Spinner extends Component {
  render() {
    return (
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-6 border-blue-500 border-t-transparent border-b-transparent" />
      </div>
    );
  }
}

export default Spinner;
