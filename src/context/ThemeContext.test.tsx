import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Helper component that exposes context values via the DOM
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  // Reset html class between tests
  document.documentElement.classList.remove('dark');
});

describe('ThemeProvider — initial theme', () => {
  it('defaults to "dark" when localStorage is empty', () => {
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('reads initial theme from localStorage when pre-seeded with "dark"', () => {
    localStorage.setItem('theme', 'dark');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('reads initial theme from localStorage when pre-seeded with "light"', () => {
    localStorage.setItem('theme', 'light');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('defaults to "dark" when localStorage contains an invalid value', () => {
    localStorage.setItem('theme', 'invalid');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});

describe('ThemeProvider — toggleTheme', () => {
  it('flips theme from "dark" to "light"', () => {
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('flips theme from "light" to "dark"', () => {
    localStorage.setItem('theme', 'light');
    renderWithProvider();
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('writes the new theme to localStorage after toggle', () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

describe('ThemeProvider — html class sync', () => {
  it('adds "dark" class to <html> when theme is "dark"', () => {
    renderWithProvider();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes "dark" class from <html> when theme is "light"', () => {
    renderWithProvider();
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('adds "dark" class when toggling back from "light" to "dark"', () => {
    localStorage.setItem('theme', 'light');
    renderWithProvider();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('useTheme — outside provider', () => {
  it('throws a descriptive error when used outside ThemeProvider', () => {
    // Suppress React's error boundary console output during this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    function BadConsumer() {
      useTheme();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
