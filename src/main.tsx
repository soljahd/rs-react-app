import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout, About, Home, ErrorBoundary, NotFoundPage, ResultsDetails } from './components';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: '/',
            element: <ResultsDetails />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('#root not found in DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
