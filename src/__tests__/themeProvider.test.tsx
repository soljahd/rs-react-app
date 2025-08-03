import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeContext } from '../context/themeContext';
import { ThemeProvider } from '../providers/themeProvider';
import type { ThemeContextType } from '../context/themeContext';

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should toggle theme mode', () => {
    const { result } = renderHook(() => useContext(ThemeContext) as ThemeContextType, {
      wrapper: ThemeProvider,
    });

    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(false);
  });
});
