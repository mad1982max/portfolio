import { PORTFOLIO_CONFIG } from '../../config/portfolio';
import logoSrc from '../../assets/my2d.png';

export default function Logo() {
  return (
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0">
      <img
        src={logoSrc}
        alt={PORTFOLIO_CONFIG.ownerName}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
}
