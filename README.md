# MetricFlow — Business Analytics Dashboard

MetricFlow is a responsive React dashboard for exploring business analytics, transactions, customers, products, and workspace settings.

The application is a frontend-only demonstration. Its centralized, deterministic dataset is illustrative benchmark data generated in [`src/data/mockData.ts`](./src/data/mockData.ts). It does not represent real customers, payments, credentials, or production business results.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local setup

Install the locked dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

## Available commands

```bash
# Start the Vite development server
npm run dev

# Run TypeScript validation and create a production bundle in dist/
npm run build

# Run the Vitest test suite once
npm test

# Serve the existing dist/ output locally
npm run preview
```

Run `npm run build` before `npm run preview`. The preview command serves the already-built `dist/` directory and is useful for checking the production bundle locally.

## Features

- Overview dashboard with KPI summaries, revenue/profit charts, order volume, acquisition channels, transactions, and conversion funnel
- Analytics page with period comparisons, category performance, customer segments, and geographic revenue views
- Customer directory with search, status filtering, metrics, and empty states
- Transactions table with reporting-period filtering, search, status filtering, sorting, pagination, CSV export, and empty states
- Products page with category performance, plans, subscribers, pricing, and MRR
- Settings workspace with general preferences, notifications, team display, API/webhook placeholders, and persisted dark/light theme selection
- Demo-only administrator login with `admin` / `admin` credentials and sessionStorage-based logout/session refresh behavior
- Responsive sidebar, mobile drawer, keyboard focus states, and light/dark themes

## Testing and data quality

The test suite covers:

- UTC-safe date boundaries and inclusive filtering
- Revenue, expense, profit, order, and customer aggregation
- Percentage comparison and zero-denominator behavior
- Transaction search, status filtering, sorting, and pagination
- CSV escaping and spreadsheet formula-injection protection
- Theme preference persistence and storage failures
- Empty and missing-value handling

Tests are run with Vitest:

```bash
npm test
```

## Backend and authentication status

The following are intentionally not implemented:

- Real authentication or authorization
- Real customer, payment, or product APIs
- Database persistence
- Server-side CSV generation
- API key issuance or validation
- Webhook ingestion
- Real notifications or team management
- Production export/reporting jobs

The API key and webhook values displayed in Settings are clearly labeled demo placeholders. Do not replace them with real credentials in frontend source code. Use a backend or a protected server-side integration for secrets.

### Demo login warning

The login screen accepts only the visible frontend credentials `admin` / `admin`. It stores only a simple authenticated flag in `sessionStorage`; it never stores the password. Because the credential check and UI are shipped to the browser, this is not security and must not be used to protect confidential data or production features. Replace it with a real server-side authentication system before any production use.

## Deployment

MetricFlow builds to a static Vite bundle:

```bash
npm ci
npm run test
npm run build
```

Deploy the generated `dist/` directory to a static hosting provider.

### Vercel

Use the following settings:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

The current application uses context-based client-side page selection rather than URL routes, so no SPA rewrite is required for the current navigation model. If React Router or another URL-based router is added later, configure a fallback rewrite from all application paths to `/index.html`.

### Netlify

Use:

- Build command: `npm run build`
- Publish directory: `dist`

For the current context-based navigation no redirect is required. If URL-based SPA routing is introduced, add a `public/_redirects` file containing:

```text
/* /index.html 200
```

### Other static hosts

Serve `dist/` from a static web server. Ensure that:

- `index.html` is served at the site root
- `/assets/*` is served without rewriting
- Future client-side routes fall back to `index.html`
- No `.env` files or secrets are uploaded

## Production limitations

- The dashboard uses illustrative in-memory data and cannot provide live analytics without a backend.
- Several demo actions remain UI placeholders.
- Recharts and the full dashboard currently produce a relatively large JavaScript bundle; Vite reports a non-blocking chunk-size warning.
- The interface has not been deployed or connected to an external account by this project.
