import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../App';
import { useFormStore } from '../store/formStore';

vi.mock('../store/formStore');

describe('App', () => {
  const mockedUseFormStore = vi.mocked(useFormStore);
  let rootModal: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();

    rootModal = document.createElement('div');
    rootModal.setAttribute('id', 'root-modal');
    document.body.appendChild(rootModal);

    mockedUseFormStore.mockReturnValue({
      controlledForms: [],
      uncontrolledForms: [],
      countries: ['USA', 'Canada', 'UK'],
      hydrateCountries: vi.fn(),
      addControlledForm: vi.fn(),
      addUncontrolledForm: vi.fn(),
    });
  });

  afterEach(() => {
    document.body.removeChild(rootModal);
  });

  it('should render main heading and buttons', () => {
    render(<App />);
    expect(screen.getByText(/React Forms/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Uncontrolled Form/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Controlled Form/i)).toBeInTheDocument();
  });

  it('should open UncontrolledForm modal when clicking the button', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Open Uncontrolled Form/i));

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('Uncontrolled Form');
  });

  it('should open ControlledForm modal when clicking the button', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Open Controlled Form/i));

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('Controlled Form');
  });

  it('should close modal when clicking the close button', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Open Controlled Form/i));
    const closeButton = screen.getByLabelText(/Close details/i);
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
