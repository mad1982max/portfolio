import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

// Mock useTheme so we can control theme value and capture toggleTheme calls
jest.mock('../../context/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

import { useTheme } from '../../context/ThemeContext';

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeToggle', () => {
  it('renders sun icon and correct aria-label when theme is "dark"', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: jest.fn() });
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveTextContent('☀️');
  });

  it('renders moon icon and correct aria-label when theme is "light"', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveTextContent('🌙');
  });

  it('clicking the button calls toggleTheme', () => {
    const toggleTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme });
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
