import { PORTFOLIO_CONFIG } from '../../config/portfolio';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {PORTFOLIO_CONFIG.copyrightYear} {PORTFOLIO_CONFIG.ownerName}. All rights reserved.
        </p>
        <p>{PORTFOLIO_CONFIG.tagline}</p>
        <div className="flex gap-3">
          {PORTFOLIO_CONFIG.skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
