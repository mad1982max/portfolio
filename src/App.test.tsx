/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import MeAboutPage from './pages/Admin/Admin';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { PORTFOLIO_CONFIG } from './config/portfolio';
import { ROUTES } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';

const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true };

function AppShell({ initialPath }: { initialPath: string }) {
  return (
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialPath]} future={routerFuture}>
        <Header />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.ADMIN} element={<MeAboutPage />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
        <Footer />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('App smoke test', () => {
  it('mounts without errors with ThemeProvider wrapping everything', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });
});

describe('Route /', () => {
  it('renders HomePage content', () => {
    render(<AppShell initialPath="/" />);
    expect(screen.getByRole('heading', { name: PORTFOLIO_CONFIG.ownerName })).toBeInTheDocument();
    expect(screen.getAllByText(PORTFOLIO_CONFIG.tagline).length).toBeGreaterThan(0);
  });
});

describe('Route /about', () => {
  it('renders AboutPage content', () => {
    render(<AppShell initialPath="/about" />);
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});

describe('Route /admin', () => {
  it('renders MeAboutPage content', () => {
    render(<AppShell initialPath="/admin" />);
    expect(screen.getByRole('heading', { name: /control panel/i })).toBeInTheDocument();
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
  });
});

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

describe('Header and Footer on all routes', () => {
  const routes = [ROUTES.HOME, ROUTES.ABOUT, ROUTES.ADMIN];

  routes.forEach((route) => {
    it(`renders Header and Footer on ${route}`, () => {
      render(<AppShell initialPath={route} />);
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
