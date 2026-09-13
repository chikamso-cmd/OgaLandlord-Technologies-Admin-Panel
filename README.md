# OgaLandlord Admin Panel

A premium, production-ready, operational compliance and moderator dashboard designed for **Oga Landlord**, Nigeria's Trusted Real Estate Platform. Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**, it features protected dashboard routes, an Axios API client, administrative security workflows, live data filters, responsive side drawer views, and high-fidelity layouts based on platform mockups.

---

## 🎨 Visual Identity & Aesthetic Principles

- **Forest Green & Mint Theme**: Anchored by a deep, rich primary green (`#004d2c`) that symbolizes prestige, real estate trust, and growth, paired with a subtle, eye-safe mint background (`#f3faf6`) and high-contrast status tags.
- **Micro-interactions & Focus states**: Input elements feature smooth transitions, and table rows use custom hover animations (`hover:bg-[#f4fcf8]/50`). Tab controllers use custom cream-white background pills with dark-green typography.
- **Architectural Clarity**: High-density elements stack neatly across responsive column counts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).

---

## 🏗️ Core Architecture & Component Directory

The system adopts a highly modular structure to prevent performance issues and maximize reuse:

1. **`src/App.tsx`**: Application entry point for authentication state, route registration, dashboard navigation, and toast notifications.
2. **`src/types.ts`**: Strict types representing data models (Agents, Listings, Reports, Subscriptions, Alerts).
3. **`src/data.ts`**: The local data source with realistic pre-populated records containing Nigerian property markets, Naira symbols (₦), local currency valuations, alerts, and report histories.
4. **`src/components/Login.tsx`**: Authentic "OgaLandlord" sign-in panel with active input states, validation feedback, and structural layout styling.
5. **`src/components/AppLayout.tsx`**: Shared protected dashboard shell containing the sidebar, header, responsive mobile drawer, search state, and modal surface.
6. **`src/components/Sidebar.tsx`**: Left navigation dock containing section routing links, numeric notification bubbles, and the interactive Admin user card. Supports a mobile drawer.
7. **`src/components/Header.tsx`**: The top bar, housing mobile hamburgers, search filtering inputs, an active alerts bell, and system credentials.
8. **`src/components/DashboardView.tsx`**: Interactive Overview featuring KPI micro-cards, color-coded alert ribbons (Danger, Warning, Info), quick-action links, and a chronological event activity list.
9. **`src/components/AgentsView.tsx`**: Comprehensive agent tracking registry table and drill-down Profile page featuring Circular Trust Score gauges, operational regions, uploaded documents (Government ID & Selfies), and active listing lists.
10. **`src/components/ListingsView.tsx`**: Real estate flat inventory search and detail pages. Displays multi-tier rent packages (caution fee, agency fee, inspection fee, service charges), eligibility requirements, and dynamic carousel indicators.
11. **`src/components/ReportsView.tsx`**: Operational dispute center detailing fraud investigations, connected evidence attachments (chat snapshots, receipts), historical compliance offenses, and interactive action panels (Banning, Suspending).
12. **`src/components/SubscriptionsView.tsx`**: Agent subscription status tracker managing billing models (₦50,000/yr plans), expired profiles, and renewal modals.
13. **`src/components/SettingsView.tsx`**: Configurations for administrator credentials, system checkboxes preferences, and a form to invite additional operators.
14. **`src/Protectedroute/ProtectedRoute.tsx`**: Route guard that redirects unauthenticated users to `/login` before rendering dashboard routes.
15. **`src/services/Axios.ts`**: Shared Axios instance configured with an API base URL, credentials, request bearer-token injection, `FormData` support, and token refresh/error handling.

---

## 🛠️ Administrative Compliance Workflows (Interactive States)

Dashboard workflows are organized around protected routes and interactive moderator views:

- **Approve Agent Verification**: Toggling verified on pending folders marks the agent "Verified", rewards a `90` trust score baseline, increments the "Verified Agents" KPI stat, and wipes pending alerts.
- **Ban Agent (Scam protection)**: Banning an agent sets their trust score to `0`, removes all active listings, restricts future posts, and records the event in the notifications tray.
- **Reduce Trust Score Index**: Reduces score metrics by custom penalizing intervals (5, 10, 20, or 50 points index value), updating response times and customer satisfaction progress indicators instantly.
- **Remove Listing**: Triggers a modal for deletion notes and instantly marks the property "Removed", updating dashboard inventory counts in real-time.
- **Renew Subscriptions**: Lets moderators extend expiring premium agent licenses for custom terms (1, 3, 6, or 12 Months), calculating pricing in Naira (₦) and restoring their Active badge of compliance.
- **Invite Admin Operators**: Submitting the administrator email adds a new profile to the active administrators table roster with designated system rights.
- **Protected dashboard access**: Unauthenticated users are redirected to `/login`; authenticated users can access `/`, `/dashboard`, `/agents`, `/listings`, `/reports`, `/subscriptions`, and `/settings`.
- **API-ready service layer**: Requests use the shared Axios client, which reads `VITE_API_BASE_URL`, sends cookies, attaches a stored bearer token, and handles expired sessions through token refresh logic.

---

## 🚀 Getting Started (Setup & Run)

Follow these directions to launch the developer bundle environment:

### Prerequisites

You need [Node.js](https://nodejs.org/) (v16+ recommended) and `npm` installed.

### Installation

1. Clone or download this project workspace repository folder.
2. Inside the root directory, open your terminal and install dependencies:
   ```bash
   npm install
   bun install
   ```

### Environment configuration

The API client reads the following Vite environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If `VITE_API_BASE_URL` is not provided, the client uses `http://localhost:5000/api`. Keep local `.env` files out of version control.

### Running Core Dev Server

Start the fast development server:

```bash
npm run dev
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser of choice to view the operational dashboard.

### Production Build compilation

Compile and bundle specialized assets to `/dist` output directory for hosting:

```bash
npm run build
bun run build
```

Run the TypeScript validation check with:

```bash
npm run lint
bun run lint
```

---

## 📜 Technology Stack Breakdown

- **React 19**: Core framework rendering active layouts and hooks.
- **TypeScript**: Typed contract validation interfaces for bulletproof refactoring.
- **Vite**: Development server and production bundler.
- **Tailwind CSS**: Utility-first grid systems & custom spacing.
- **React Router**: Browser routing and protected dashboard routes.
- **Axios**: Centralized API requests with credentials and token refresh handling.
- **React Toastify**: Global toast notification container.
- **Lucide React**: Vector layout icons closely matching visual weight in mockups.
