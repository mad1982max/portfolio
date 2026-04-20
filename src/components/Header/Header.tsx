import { useState } from 'react';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { APP_VERSION } from '../../config/appVersion';

export default function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 md:h-16 lg:h-18 flex items-center justify-between px-4 md:px-8 dark:bg-gray-900 dark:text-white bg-white text-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            v{APP_VERSION}
          </span>
        </div>
        <div className="hidden md:flex">
          <Navigation layout="horizontal" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <HamburgerMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)} />
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden">
          <Navigation layout="vertical" onNavLinkClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
