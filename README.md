# Waste Management Platform

A modern waste management and sustainability dashboard built with Next.js, React, and Tailwind CSS. The platform presents role-based dashboards for residents, waste companies, and central authorities, with operational views for vehicle tracking, route planning, analytics, audits, and governance workflows.

## Features

- Resident portal for service requests and reporting
- Waste company dashboard for operations and fleet activity
- Central authority dashboards for supervision, analytics, and audit oversight
- Route visualization and vehicle tracking components
- Role-based access control patterns for different user types
- Clean, responsive UI powered by shadcn/ui and Tailwind CSS

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui component system
- Recharts for analytics visualizations

## Project Structure

- `app/` — application routes and base layout
- `components/` — UI and dashboard components
- `lib/` — shared utilities and RBAC metadata
- `public/` — static assets
- `styles/` — global styling

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

2. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   ```bash
   http://localhost:3000
   ```

## Production Build

```bash
npm run build
npm run start
```

## Deployment

This project is configured for deployment on Vercel and other Node-compatible hosting providers.

### Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Set the project framework to Next.js.
4. Add any required environment variables in the Vercel dashboard.
5. Deploy the project.

Recommended production environment values:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Waste Management Platform
```

### Production Notes

- The app uses a standalone Next.js output for cleaner server deployments.
- Static assets and dashboard components are optimized for production builds.
- If you are integrating with a backend API, add the correct public API base URL to your environment configuration.

## Environment Variables

Use `.env.local` for local development and configure the same values in your deployment platform.

## License

This project is intended for educational and demonstration purposes unless otherwise specified by the repository owner.
