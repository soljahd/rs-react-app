import { Component } from 'react';

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

class Spinner extends Component<Props> {
  getSizeClasses() {
    const { size = 'md' } = this.props;
    const sizeClasses = {
      xs: 'h-3 w-3 border-2',
      sm: 'h-4 w-4 border-3',
      md: 'h-6 w-6 border-4',
      lg: 'h-8 w-8 border-5',
      xl: 'h-10 w-10 border-6',
    };
    return sizeClasses[size];
  }

  render() {
    const sizeClasses = this.getSizeClasses();
    return (
      <div className="flex items-center justify-center">
        <div className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses}`} />
      </div>
    );
  }
}

export default Spinner;
