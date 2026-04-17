/// <reference types="@testing-library/jest-dom" />
/**
 * Bug Condition Exploration Tests
 *
 * Property 1: Bug Condition — Dark Theme Classes Missing on HomePage, Footer, Navigation
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bug exists.
 * They encode the expected behavior and will pass after the fix is applied.
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 */
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import Navigation from './components/Navigation/Navigation';

describe('Bug Condition: Dark theme classes missing on affected components', () => {
  /**
   * Requirement 1.1 — HomePage <main> has no dark: classes
   * Counterexample: <main> has no className — dark variants cannot activate
   */
  it('HomePage <main> has class dark:bg-gray-900 when rendered inside a dark wrapper', () => {
    const { container } = render(
      <div className="dark">
        <HomePage />
      </div>
    );
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('dark:bg-gray-900');
  });

  /**
   * Root cause fix confirmed: <main> now has className with light + dark classes.
   */
  it('HomePage <main> has className with light and dark classes after fix', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-white', 'text-gray-900', 'dark:bg-gray-900', 'dark:text-white');
  });

  /**
   * Requirement 1.2 — Footer <footer> has no dark: classes
   * Counterexample: <footer> has no className — dark variants cannot activate
   */
  it('Footer <footer> has class dark:bg-gray-900 when rendered inside a dark wrapper', () => {
    const { container } = render(
      <div className="dark">
        <Footer />
      </div>
    );
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('dark:bg-gray-900');
  });

  /**
   * Root cause fix confirmed: <footer> now has className with light + dark classes.
   */
  it('Footer <footer> has className with light and dark classes after fix', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-white', 'text-gray-900', 'dark:bg-gray-900', 'dark:text-white');
  });

  /**
   * Requirement 1.3 — Navigation NavLinks have no dark: color classes
   * Counterexample: NavLink className callback returns only layout/active classes — no color classes
   */
  it('Navigation NavLinks have class dark:text-white when rendered inside a dark wrapper', () => {
    const { container } = render(
      <div className="dark">
        <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Navigation layout="horizontal" />
        </MemoryRouter>
      </div>
    );
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveClass('dark:text-white');
    });
  });
});
