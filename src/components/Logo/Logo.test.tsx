import { render, screen } from '@testing-library/react';
import Logo from './Logo';
import { PORTFOLIO_CONFIG } from '../../config/portfolio';

describe('Logo', () => {
  it('renders img with placeholder src', () => {
    render(<Logo />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://placehold.co/40x40');
  });

  it('renders img with alt equal to ownerName', () => {
    render(<Logo />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', PORTFOLIO_CONFIG.ownerName);
  });

  it('renders img with correct size and shape classes', () => {
    render(<Logo />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-10', 'h-10', 'rounded-full');
  });
});
