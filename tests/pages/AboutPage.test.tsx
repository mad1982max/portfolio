/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import AboutPage from '../../src/pages/AboutPage';
import { PORTFOLIO_CONFIG } from '../../src/config/portfolio';

describe('AboutPage', () => {
    it('renders a <main> element', () => {
        render(<AboutPage />);
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders the biography section', () => {
        render(<AboutPage />);
        expect(screen.getByRole('region', { name: 'Biography' })).toBeInTheDocument();
    });

    it('renders the skills list', () => {
        render(<AboutPage />);
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        PORTFOLIO_CONFIG.skills.forEach((skill) => {
            expect(screen.getByText(skill)).toBeInTheDocument();
        });
    });
});
