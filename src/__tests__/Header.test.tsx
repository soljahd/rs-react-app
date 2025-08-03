import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Header } from '../components';
import { ThemeProvider } from '../providers/themeProvider';

describe('Header Component', () => {
  it('should renders correctly', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should contains navigation links', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>,
    );

    const mainLink = screen.getByText('Main');
    const aboutLink = screen.getByText('About');

    expect(mainLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(mainLink).toHaveAttribute('href', '/main');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should render Main as span when on main page', () => {
    render(
      <MemoryRouter initialEntries={['/main']}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>,
    );
    const mainElement = screen.getByText('Main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('cursor-default');
    expect(mainElement.tagName).toBe('SPAN');
  });

  it('should render About as span when on about page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>,
    );
    const mainElement = screen.getByText('About');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('cursor-default');
    expect(mainElement.tagName).toBe('SPAN');
  });
});
