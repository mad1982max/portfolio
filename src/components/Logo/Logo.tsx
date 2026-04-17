import { PORTFOLIO_CONFIG } from '../../config/portfolio';

export default function Logo() {
  return (
    <img
      src="https://placehold.co/40x40"
      alt={PORTFOLIO_CONFIG.ownerName}
      className="w-10 h-10 rounded-full"
    />
  );
}
