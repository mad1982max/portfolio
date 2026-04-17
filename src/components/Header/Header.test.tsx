/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from './Header';

function renderHeader(initialPath = '/') {
  return render(
    <ThemeProvider>
      <MemoryRouter
        initialEntries={[initialPath]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('has sticky, top-0, and z-50 classes', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
    expect(header).toHaveClass('z-50');
  });

  it('renders Logo', () => {
    renderHeader();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders Navigation', () => {
    renderHeader();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders ThemeToggle', () => {
    renderHeader();
    expect(
      screen.getByRole('button', { name: /switch to (light|dark) mode/i })
    ).toBeInTheDocument();
  });

  it('renders HamburgerMenu button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('clicking HamburgerMenu opens the mobile drawer (Navigation in vertical layout appears)', () => {
    renderHeader();
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    // After opening, there should be two navigations (inline + drawer)
    const navs = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navs.length).toBe(2);
  });

  it('clicking a NavLink in the mobile drawer closes it', () => {
    renderHeader();
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);

    // Drawer is open — find the vertical nav links
    const navs = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navs.length).toBe(2);

    // Click a link inside the drawer (second nav is the vertical one)
    const drawerLinks = navs[1].querySelectorAll('a');
    fireEvent.click(drawerLinks[0]);

    // Drawer should be closed — only one nav remains
    const navsAfter = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navsAfter.length).toBe(1);
  });
});
