import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Header } from './';

export default function AppLayout() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('This is a test error from the error button!');
  }
  return (
    <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-start gap-8 p-4">
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="error-button flex justify-end">
        <Button color="error" onClick={throwError}>
          Throw Error
        </Button>
      </div>
    </div>
  );
}
