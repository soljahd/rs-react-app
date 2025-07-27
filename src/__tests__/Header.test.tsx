import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Header } from '../components';

describe('Header Component', () => {
  it('should renders correctly', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should contains navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const mainLink = screen.getByText('Main');
    const aboutLink = screen.getByText('About');

    expect(mainLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(mainLink).toHaveAttribute('href', '/main');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
