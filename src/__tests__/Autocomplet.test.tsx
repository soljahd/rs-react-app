import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Autocomplete from '../components/Autocomplete';

describe('Autocomplete', () => {
  const options = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'];

  it('should render input and label', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} id="fruit" options={options} />);
    expect(screen.getByLabelText(/Fruit/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display all options when focused with empty value', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} id="fruit" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    options.forEach((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('should filter options based on input value', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="an" onChange={onChange} id="fruit" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Grape')).toBeNull();
  });

  it('should call onChange and close list when option is clicked', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} id="fruit" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    const option = screen.getByText('Apple');
    fireEvent.mouseDown(option);

    expect(onChange).toHaveBeenCalledWith('Apple');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('should show error message if error prop is passed', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} id="fruit" options={options} error="Required" />);

    expect(screen.getByText(/Required/i)).toBeInTheDocument();
  });

  it('should close options list when input loses focus', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} id="fruit" options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
