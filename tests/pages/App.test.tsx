/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../src/pages/HomePage';
import AboutPage from '../../src/pages/AboutPage';
import MeAboutPage from '../../src/pages/MeAboutPage';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { PORTFOLIO_CONFIG } from '../../src/config/portfolio';

// Helper: render App-like shell with a given initial route using MemoryRouter
// (HashRouter cannot be driven by MemoryRouter, so we compose the same structure)
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../src/routes';

function AppShell({ initialPath }: { initialPath: string }) {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <Header />
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path={ROUTES.ME_ABOUT} element={<MeAboutPage />} />
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
            <Footer />
        </MemoryRouter>
    );
}

// --- 2.1 Route "/" renders HomePage ---
describe('Route /', () => {
    it('renders HomePage content', () => {
        render(<AppShell initialPath="/" />);
        expect(screen.getByRole('heading', { name: PORTFOLIO_CONFIG.ownerName })).toBeInTheDocument();
        expect(screen.getByText(PORTFOLIO_CONFIG.tagline)).toBeInTheDocument();
    });
});

// --- 2.2 Route "/about" renders AboutPage ---
describe('Route /about', () => {
    it('renders AboutPage content', () => {
        render(<AppShell initialPath="/about" />);
        expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument();
        expect(screen.getByRole('list')).toBeInTheDocument();
    });
});

// --- 2.3 Route "/me/about" renders MeAboutPage ---
describe('Route /me/about', () => {
    it('renders MeAboutPage content', () => {
        render(<AppShell initialPath="/me/about" />);
        expect(screen.getByRole('heading', { name: /control panel/i })).toBeInTheDocument();
        expect(screen.getByText(/feature management will be added later/i)).toBeInTheDocument();
    });
});

// --- 2.4 Unknown routes redirect to HomePage ---
describe('Unknown route redirect', () => {
    it('redirects /unknown to HomePage', () => {
        render(<AppShell initialPath="/unknown" />);
        expect(screen.getByRole('heading', { name: PORTFOLIO_CONFIG.ownerName })).toBeInTheDocument();
    });

    it('redirects /some/deep/path to HomePage', () => {
        render(<AppShell initialPath="/some/deep/path" />);
        expect(screen.getByRole('heading', { name: PORTFOLIO_CONFIG.ownerName })).toBeInTheDocument();
    });
});

// --- Header and Footer present on all known routes ---
describe('Header and Footer on all routes', () => {
    const routes = [ROUTES.HOME, ROUTES.ABOUT, ROUTES.ME_ABOUT];

    routes.forEach((route) => {
        it(`renders Header and Footer on ${route}`, () => {
            render(<AppShell initialPath={route} />);
            expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        });
    });
});
