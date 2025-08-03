import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTheme } from '../hooks/useTheme';

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useTheme', () => {
  it('should throw error when used without ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
