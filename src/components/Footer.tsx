import { PORTFOLIO_CONFIG } from '../config/portfolio';

export default function Footer() {
  return (
    <footer>
      <p>
        © {PORTFOLIO_CONFIG.copyrightYear} {PORTFOLIO_CONFIG.ownerName}
      </p>
    </footer>
  );
}
