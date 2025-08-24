import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataTile from '../components/DataTile';

const sampleData = {
  name: 'John',
  age: '30',
  email: 'john@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  gender: 'male' as 'male' | 'female',
  country: 'USA',
  terms: true,
  image: 'base64string',
};

describe('DataTile', () => {
  it('should render name, age, email, gender, country', () => {
    render(<DataTile data={sampleData} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText(/30 years/)).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('should render image if provided', () => {
    render(<DataTile data={sampleData} />);

    const img = screen.getByAltText("John's avatar");
    expect(img).toBeInTheDocument();
  });

  it('should render fallback avatar if no image is provided', () => {
    const dataWithoutImage = { ...sampleData, image: '' };
    render(<DataTile data={dataWithoutImage} />);

    expect(screen.getByText((content) => content.includes('Age:'))).toBeInTheDocument();
    const img = screen.queryByAltText(/avatar/i);
    expect(img).toBeNull();
  });

  it('should display "New entry" badge if _new is true', () => {
    render(<DataTile data={{ ...sampleData, _new: true }} />);

    expect(screen.getByText(/New entry/i)).toBeInTheDocument();
    expect(screen.getByText(/New entry/i).previousSibling).toHaveClass('h-2 w-2');
  });

  it('should not display "New entry" badge if _new is false', () => {
    render(<DataTile data={{ ...sampleData, _new: false }} />);

    expect(screen.queryByText(/New entry/i)).toBeNull();
  });
});
