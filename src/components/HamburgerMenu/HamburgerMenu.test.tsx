import { render, screen, fireEvent } from '@testing-library/react';
import HamburgerMenu from './HamburgerMenu';

describe('HamburgerMenu', () => {
  it('has aria-label "Open navigation menu" when isOpen=false', () => {
    render(<HamburgerMenu isOpen={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Open navigation menu');
  });

  it('has aria-label "Close navigation menu" when isOpen=true', () => {
    render(<HamburgerMenu isOpen={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close navigation menu');
  });

  it('aria-expanded reflects isOpen', () => {
    const { rerender } = render(<HamburgerMenu isOpen={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    rerender(<HamburgerMenu isOpen={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking the button calls onToggle', () => {
    const onToggle = jest.fn();
    render(<HamburgerMenu isOpen={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
