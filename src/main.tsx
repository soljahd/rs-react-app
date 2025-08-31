import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Spinner from './components/Spinner';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('#root not found in DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="flex min-h-lvh items-center justify-center">
          <Spinner size="xxl" />
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>,
);
