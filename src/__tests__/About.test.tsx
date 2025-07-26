import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from '../components';

describe('About Component', () => {
  it('renders heading correctly', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Author');
  });

  it('contains ProfileCard', () => {
    render(<About />);

    expect(screen.getByText('Dzmitry Solahub')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });
});
