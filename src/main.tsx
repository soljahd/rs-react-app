import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout, About, Home, ErrorBoundary, NotFoundPage, ResultsDetails } from './components';
import { store } from './store';

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
        index: true,
        element: <Navigate to="/main" replace />,
      },
      {
        path: '/main',
        element: <Home />,
        children: [
          {
            path: '/main',
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
