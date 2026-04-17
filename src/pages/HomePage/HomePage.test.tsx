/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { PORTFOLIO_CONFIG } from '../../config/portfolio';

describe('HomePage', () => {
  it('renders a <main> element', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the developer name heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: PORTFOLIO_CONFIG.ownerName })).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<HomePage />);
    expect(screen.getByText(PORTFOLIO_CONFIG.tagline)).toBeInTheDocument();
  });
});
