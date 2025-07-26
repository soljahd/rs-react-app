import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AppLayout, ErrorBoundary } from '../components';

describe('AppLayout Component', () => {
  it('should displays fallback UI when App throws after clicking error button', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      </MemoryRouter>,
    );

    const throwButton = await screen.findByRole('button', { name: /throw error/i });
    await userEvent.click(throwButton);

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
  });
});
