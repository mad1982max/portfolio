import { PORTFOLIO_CONFIG } from '../../config/portfolio';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <p>
        © {PORTFOLIO_CONFIG.copyrightYear} {PORTFOLIO_CONFIG.ownerName}
      </p>
    </footer>
  );
}
