import { Link } from 'react-router-dom';
import Button from './Button';

function NotFoundPage() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-white p-8 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>

        <p className="text-lg text-gray-600">
          Looks like you&apos;ve gotten lost in digital space. Let&apos;s get you back on track.
        </p>

        <Link to="/">
          <Button color="primary" size="md">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
