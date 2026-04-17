interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function HamburgerMenu({ isOpen, onToggle }: HamburgerMenuProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      className="md:hidden"
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
}
