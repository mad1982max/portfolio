/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import MeAboutPage from '../../src/pages/MeAboutPage';

describe('MeAboutPage', () => {
    it('renders a <main> element', () => {
        render(<MeAboutPage />);
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders the control panel heading', () => {
        render(<MeAboutPage />);
        expect(screen.getByRole('heading', { name: /control panel/i })).toBeInTheDocument();
    });

    it('renders placeholder content about future feature management', () => {
        render(<MeAboutPage />);
        expect(screen.getByText(/feature management will be added later/i)).toBeInTheDocument();
    });
});
