# Developer Portfolio

A modern portfolio SPA built with React 18, TypeScript, Vite, and TailwindCSS. Includes three pages (Home, About, MeAbout), full test coverage via Jest + React Testing Library, ESLint/Prettier, pre-commit hooks, and GitHub Pages deployment.

## Prerequisites

- Node.js 18+
- npm 9+

## Local Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Coverage thresholds: 80% lines, branches, and functions.

## Linting & Formatting

```bash
# Check for lint errors
npm run lint

# Format source files
npm run format

# Check formatting without writing
npm run format:check
```

## Building

```bash
npm run build
```

Generates static files in `dist/` with the `/` base path for GitHub Pages.

## Deployment

### GitHub Actions (recommended)

The repository includes a workflow at `.github/workflows/deploy.yml` that automatically deploys to GitHub Pages on every push to `main`.

To enable it:

1. Go to your repository **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow will lint, test, build, and deploy automatically

The live site will be available at `https://<your-username>.github.io/`.

### Manual deployment with gh-pages

```bash
npm run build
npx gh-pages -d dist
```

> **Note:** The app uses `HashRouter`, so all client-side routes work on GitHub Pages without any server configuration.
