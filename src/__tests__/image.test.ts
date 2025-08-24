import { describe, it, expect, vi } from 'vitest';
import { fileToBase64, validateImage } from '../utils/image';

describe('fileToBase64', () => {
  it('should convert a file to base64 string', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const mockFileReader = {
      result: 'data:image/png;base64,TEST',
      readAsDataURL: vi.fn(),
      onload: null as ((ev: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev: ProgressEvent<FileReader>) => void) | null,
    };

    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader) as unknown as typeof FileReader);

    setTimeout(() => {
      mockFileReader.onload?.({} as ProgressEvent<FileReader>);
    }, 0);

    const result = await fileToBase64(file);
    expect(result).toBe('data:image/png;base64,TEST');
  });

  it('should reject if FileReader errors', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const mockFileReader = {
      result: null,
      readAsDataURL: vi.fn(),
      onload: null as ((ev: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev: ProgressEvent<FileReader>) => void) | null,
    };

    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader) as unknown as typeof FileReader);

    setTimeout(() => {
      mockFileReader.onerror?.({} as ProgressEvent<FileReader>);
    }, 0);

    await expect(fileToBase64(file)).rejects.toBeInstanceOf(Object);
  });
});

describe('validateImage', () => {
  it('should return null for valid PNG file under 2MB', () => {
    const file = new File(['dummy'], 'file.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    expect(validateImage(file)).toBeNull();
  });

  it('should return null for valid JPEG file under 2MB', () => {
    const file = new File(['dummy'], 'file.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    expect(validateImage(file)).toBeNull();
  });

  it('should return error for unsupported file type', () => {
    const file = new File(['dummy'], 'file.gif', { type: 'image/gif' });
    expect(validateImage(file)).toBe('Only PNG or JPEG allowed');
  });

  it('should return error for file larger than 2MB', () => {
    const file = new File(['dummy'], 'file.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 });
    expect(validateImage(file)).toBe('Max file size is 2MB');
  });
});
