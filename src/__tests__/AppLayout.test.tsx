import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AppLayout } from '../components';
import { ThemeProvider } from '../providers/themeProvider';

describe('App layout Component', () => {
  it('should have header', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
