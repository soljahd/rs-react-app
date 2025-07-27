import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { NotFoundPage } from '../components';

describe('NotFoundPage', () => {
  it('should renders correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Looks like you've gotten lost in digital space/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404 - Page Not Found');
  });

  it('should contains a link to home page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: /Return to Homepage/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
