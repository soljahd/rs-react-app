import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ControlledForm from '../components/ControlledForm';
import { useFormStore } from '../store/formStore';
import * as imageUtils from '../utils/image';
import type { Store } from '../store/formStore';

vi.mock('../store/formStore');
vi.mock('../utils/image');

describe('ControlledForm', () => {
  const addControlledFormMock = vi.fn();
  const onCloseMock = vi.fn();

  const mockedUseFormStore = vi.mocked(useFormStore);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFormStore.mockReturnValue({
      addControlledForm: addControlledFormMock,
      countries: ['USA', 'Canada', 'UK'],
    } as unknown as Store);
  });

  it('should render all form fields', () => {
    render(<ControlledForm onClose={onCloseMock} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I accept Terms/i)).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<ControlledForm onClose={onCloseMock} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    render(<ControlledForm onClose={onCloseMock} />);
    const file = new File(['test content'], 'test.png', { type: 'image/png' });

    const mockedValidateImage = vi.mocked(imageUtils.validateImage);
    const mockedFileToBase64 = vi.mocked(imageUtils.fileToBase64);

    mockedValidateImage.mockReturnValue(null);
    mockedFileToBase64.mockResolvedValue('base64string');

    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText(/Age/i), { target: { value: '30' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'Password123!' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Picture/i), { target: { files: [file] } });
    fireEvent.click(screen.getByLabelText(/I accept Terms/i));

    await waitFor(() => {
      expect(screen.getByAltText(/Preview/i)).toHaveAttribute('src', 'base64string');
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(addControlledFormMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: '30',
          email: 'john@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          gender: 'male',
          country: 'USA',
          terms: true,
          image: 'base64string',
        }),
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('should show error for invalid image', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    const mockedValidateImage = vi.mocked(imageUtils.validateImage);
    const mockedFileToBase64 = vi.mocked(imageUtils.fileToBase64);

    mockedValidateImage.mockReturnValue('Invalid image');
    mockedFileToBase64.mockResolvedValue('base64string');

    render(<ControlledForm onClose={onCloseMock} />);

    const input = screen.getByLabelText(/Picture/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid image/i)).toBeInTheDocument();
    });
  });

  it('should preview valid image', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    const mockedValidateImage = vi.mocked(imageUtils.validateImage);
    const mockedFileToBase64 = vi.mocked(imageUtils.fileToBase64);

    mockedValidateImage.mockReturnValue(null);
    mockedFileToBase64.mockResolvedValue('base64string');

    render(<ControlledForm onClose={onCloseMock} />);

    const input = screen.getByLabelText(/Picture/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText(/Preview/i)).toHaveAttribute('src', 'base64string');
    });
  });
});
