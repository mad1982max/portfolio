/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';
import { ROUTES } from '../../routes';

const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true };

function renderNav(
  layout: 'horizontal' | 'vertical',
  initialPath = '/',
  onNavLinkClick?: () => void
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]} future={routerFuture}>
      <Navigation layout={layout} onNavLinkClick={onNavLinkClick} />
    </MemoryRouter>
  );
}

describe('Navigation', () => {
  it('renders exactly Object.keys(ROUTES).length NavLinks', () => {
    renderNav('horizontal');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(Object.keys(ROUTES).length);
  });

  it('active NavLink receives font-bold and underline; others do not', () => {
    renderNav('horizontal', '/about');
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('font-bold');
    expect(aboutLink).toHaveClass('underline');

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).not.toHaveClass('font-bold');
    expect(homeLink).not.toHaveClass('underline');
  });

  it('vertical layout applies min-h-[44px] to each link', () => {
    renderNav('vertical');
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.className).toContain('min-h-[44px]');
    });
  });

  it('onNavLinkClick is called when a link is clicked', () => {
    const handler = jest.fn();
    renderNav('horizontal', '/', handler);
    fireEvent.click(screen.getByRole('link', { name: /home/i }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
