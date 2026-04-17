import { PORTFOLIO_CONFIG } from '../../config/portfolio';

export default function Logo() {
  return (
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0">
      <img
        src="/my3d.gif"
        alt={PORTFOLIO_CONFIG.ownerName}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
}
