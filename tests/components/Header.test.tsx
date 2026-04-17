import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../src/components/Header';

describe('Header', () => {
    it('renders nav with aria-label', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);
        expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('renders all three nav links', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /me about/i })).toBeInTheDocument();
    });

    it('links point to correct routes', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);
        expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute('href', '/about');
        expect(screen.getByRole('link', { name: /me about/i })).toHaveAttribute('href', '/me/about');
    });

    it('applies active class to the current route link', () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <Header />
            </MemoryRouter>
        );
        const aboutLink = screen.getByRole('link', { name: /^about$/i });
        expect(aboutLink).toHaveClass('font-bold');
        expect(aboutLink).toHaveClass('underline');
    });

    it('does not apply active class to inactive links', () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <Header />
            </MemoryRouter>
        );
        const homeLink = screen.getByRole('link', { name: /home/i });
        expect(homeLink).not.toHaveClass('font-bold');
    });
});
