/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { PORTFOLIO_CONFIG } from '../../src/config/portfolio';

describe('Footer', () => {
    it('renders a footer element', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('displays the copyright year', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toHaveTextContent(
            String(PORTFOLIO_CONFIG.copyrightYear)
        );
    });

    it('displays the owner name', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toHaveTextContent(
            PORTFOLIO_CONFIG.ownerName
        );
    });

    it('displays the full copyright string', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toHaveTextContent(
            `© ${PORTFOLIO_CONFIG.copyrightYear} ${PORTFOLIO_CONFIG.ownerName}`
        );
    });
});
