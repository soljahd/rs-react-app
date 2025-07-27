type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type SpinnerProps = {
  size?: SpinnerSize;
};

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border-2',
  sm: 'h-4 w-4 border-3',
  md: 'h-6 w-6 border-4',
  lg: 'h-8 w-8 border-5',
  xl: 'h-10 w-10 border-6',
};

function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`} />
    </div>
  );
}

export default Spinner;
