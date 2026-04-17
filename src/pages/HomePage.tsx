import { PORTFOLIO_CONFIG } from '../config/portfolio';

interface HomePageProps { }

export default function HomePage(_props: HomePageProps) {
    return (
        <main>
            <h1>{PORTFOLIO_CONFIG.ownerName}</h1>
            <p>{PORTFOLIO_CONFIG.tagline}</p>
        </main>
    );
}
