import { PORTFOLIO_CONFIG } from '../config/portfolio';

export default function HomePage() {
  return (
    <main>
      <h1>{PORTFOLIO_CONFIG.ownerName}</h1>
      <p>{PORTFOLIO_CONFIG.tagline}</p>
    </main>
  );
}
