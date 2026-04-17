import { PORTFOLIO_CONFIG } from '../../config/portfolio';

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h1>{PORTFOLIO_CONFIG.ownerName}</h1>
      <p>{PORTFOLIO_CONFIG.tagline}</p>
    </main>
  );
}
