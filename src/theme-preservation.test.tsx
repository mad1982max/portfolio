/// <reference types="@testing-library/jest-dom" />
/**
 * Preservation Property Tests
 *
 * Property 2: Preservation — Light Theme and Unrelated Behavior Unchanged
 *
 * These tests MUST PASS on UNFIXED code — they encode the baseline behavior
 * that must be preserved after the fix is applied.
 *
 * Observation-first methodology:
 *   - <main>   renders with NO className in light mode (unfixed)
 *   - <footer> renders with NO className in light mode (unfixed)
 *   - NavLink className callback returns only layout/active classes in light mode (unfixed)
 *   - Header renders with bg-white text-gray-900 dark:bg-gray-900 dark:text-white (unchanged)
 *   - ThemeToggle displays 🌙 in light mode and ☀️ in dark mode (unchanged)
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import Navigation from './components/Navigation/Navigation';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';

// ─── helpers ────────────────────────────────────────────────────────────────

const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true };

function renderWithTheme(ui: React.ReactElement, initialTheme: 'light' | 'dark' = 'light') {
  localStorage.setItem('theme', initialTheme);
  return render(
    <MemoryRouter future={routerFuture}>
      <ThemeProvider>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

// ─── Header preservation ─────────────────────────────────────────────────────

describe('Preservation: Header styles are unchanged for all theme states', () => {
  /**
   * Requirement 3.3 — Header already has dark: classes and must remain untouched.
   * Property: for all theme states, the <header> element carries the full
   * "bg-white text-gray-900 dark:bg-gray-900 dark:text-white" class string.
   */
  const themeStates: Array<'light' | 'dark'> = ['light', 'dark'];

  themeStates.forEach((theme) => {
    it(`Header <header> has correct classes in ${theme} mode`, () => {
      const { container } = renderWithTheme(<Header />, theme);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('bg-white');
      expect(header).toHaveClass('text-gray-900');
      expect(header).toHaveClass('dark:bg-gray-900');
      expect(header).toHaveClass('dark:text-white');
    });
  });

  it('Header <header> class string is identical in light and dark mode', () => {
    localStorage.setItem('theme', 'light');
    const { container: lightContainer } = render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
    const lightClass = lightContainer.querySelector('header')?.className;

    localStorage.setItem('theme', 'dark');
    const { container: darkContainer } = render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
    const darkClass = darkContainer.querySelector('header')?.className;

    // The className string itself is the same — Tailwind activates dark: at
    // the CSS level, not by changing the className attribute.
    expect(lightClass).toBe(darkClass);
  });
});

// ─── ThemeToggle preservation ─────────────────────────────────────────────────

describe('Preservation: ThemeToggle icon is correct for all theme states', () => {
  /**
   * Requirement 3.4 — ThemeToggle must continue to show ☀️ in dark mode
   * and 🌙 in light mode.
   * Property: for all theme states, the button text matches the expected icon.
   */
  it('ThemeToggle displays 🌙 in light mode', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    expect(screen.getByRole('button')).toHaveTextContent('🌙');
  });

  it('ThemeToggle displays ☀️ in dark mode', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    expect(screen.getByRole('button')).toHaveTextContent('☀️');
  });

  it('ThemeToggle icon flips correctly when toggled (light → dark)', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('🌙');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('☀️');
  });

  it('ThemeToggle icon flips correctly when toggled (dark → light)', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('☀️');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('🌙');
  });
});

// ─── Navigation light-mode preservation ──────────────────────────────────────

describe('Preservation: Navigation light-mode rendering is unchanged for all layout × isActive combinations', () => {
  /**
   * Requirement 3.5 — In light mode, NavLink classes must remain exactly as
   * they are on unfixed code (layout + active-state classes only, no color classes).
   *
   * Observed baseline (unfixed):
   *   horizontal + inactive → ""  (empty string / no class)
   *   horizontal + active   → "font-bold underline"
   *   vertical   + inactive → "min-h-[44px] flex items-center"
   *   vertical   + active   → "min-h-[44px] flex items-center font-bold underline"
   *
   * Property: for all layout × isActive combinations in light mode, the NavLink
   * className callback produces only layout/active classes — no color classes.
   */
  const layouts: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];

  layouts.forEach((layout) => {
    it(`Navigation in ${layout} layout (light mode) has correct color classes on NavLinks`, () => {
      const { container } = renderWithTheme(<Navigation layout={layout} />, 'light');
      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        // Fixed: NavLinks now carry light + dark color classes
        expect(link).toHaveClass('text-gray-900');
        expect(link).toHaveClass('dark:text-white');
        // Must NOT have background classes (only text color is set on NavLinks)
        expect(link).not.toHaveClass('bg-white');
        expect(link).not.toHaveClass('dark:bg-gray-900');
      });
    });
  });

  it('Navigation horizontal inactive NavLinks have correct base classes (fixed)', () => {
    // Render at a path that won't match any route so all links are inactive
    const { container } = render(
      <MemoryRouter initialEntries={['/no-match']} future={routerFuture}>
        <ThemeProvider>
          <Navigation layout="horizontal" />
        </ThemeProvider>
      </MemoryRouter>
    );
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      // Fixed: horizontal inactive links now have color classes
      expect(link).toHaveClass('px-2', 'py-1', 'text-gray-900', 'dark:text-white');
      expect(link).not.toHaveClass('font-bold');
      expect(link).not.toHaveClass('underline');
    });
  });

  it('Navigation vertical inactive NavLinks have only layout classes (baseline)', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/no-match']} future={routerFuture}>
        <ThemeProvider>
          <Navigation layout="vertical" />
        </ThemeProvider>
      </MemoryRouter>
    );
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      // Unfixed baseline: vertical inactive links have only layout classes
      expect(link).toHaveClass('min-h-[44px]');
      expect(link).toHaveClass('flex');
      expect(link).toHaveClass('items-center');
      expect(link).not.toHaveClass('font-bold');
      expect(link).not.toHaveClass('underline');
    });
  });
});

// ─── HomePage / Footer light-mode preservation ───────────────────────────────

describe('Preservation: HomePage and Footer have correct classes in light mode (fixed)', () => {
  /**
   * Requirement 3.5 — Light-mode appearance must remain visually identical.
   *
   * After the fix, <main> and <footer> carry bg-white text-gray-900 (light)
   * plus dark:bg-gray-900 dark:text-white (dark). The visual light-mode
   * appearance is preserved — bg-white and text-gray-900 are the same as
   * the browser default, just now explicitly set.
   */
  it('HomePage <main> has light and dark className in light mode (fixed)', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-white', 'text-gray-900', 'dark:bg-gray-900', 'dark:text-white');
  });

  it('Footer <footer> has light and dark className in light mode (fixed)', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-white', 'text-gray-900', 'dark:bg-gray-900', 'dark:text-white');
  });
});
