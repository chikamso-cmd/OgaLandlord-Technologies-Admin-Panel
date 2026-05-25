# OgaLandlord Admin Panel

A premium, production-ready, operational compliance and moderator dashboard designed for **Oga Landlord**, Nigeria's Trusted Real Estate Platform. Built with **React 19**, **TypeScript**, and **Tailwind CSS**, it features full mock database reactivity, administrative security workflows, live data filters, responsive side drawer views, and high-fidelity layouts based on platform mockups.

---

## 🎨 Visual Identity & Aesthetic Principles

- **Forest Green & Mint Theme**: Anchored by a deep, rich primary green (`#004d2c`) that symbolizes prestige, real estate trust, and growth, paired with a subtle, eye-safe mint background (`#f3faf6`) and high-contrast status tags.
- **Micro-interactions & Focus states**: Input elements feature smooth transitions, and table rows use custom hover animations (`hover:bg-[#f4fcf8]/50`). Tab controllers use custom cream-white background pills with dark-green typography.
- **Architectural Clarity**: High-density elements stack neatly across responsive column counts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).

---

## 🏗️ Core Architecture & Component Directory

The system adopts a highly modular structure to prevent performance issues and maximize reuse:

1. **`src/types.ts`**: Strict types representing data models (Agents, Listings, Reports, Subscriptions, Alerts).
2. **`src/data.ts`**: The mocked database with realistic pre-populated records containing Nigerian property markets, Naira symbols (₦), local currency valuations, and report histories.
3. **`src/components/Login.tsx`**: Authentic "OgaLandlord" sign-in panel with active input states, validation feedback, and structural layout styling, with toggle handlers.
4. **`src/components/Sidebar.tsx`**: Left navigation dock containing section routing links, numeric notification bubbles, and the interactive Admin user card. Supports a mobile drawer.
5. **`src/components/Header.tsx`**: The top bar, housing mobile hamburgers, search filtering inputs, an active alerts bell, and system credentials.
6. **`src/components/DashboardView.tsx`**: Interactive Overview featuring 6 KPI micro-cards, color-coded alert ribbons (Danger, Warning, Info), quick-action links, and a chronological event activity list.
7. **`src/components/AgentsView.tsx`**: Comprehensive agent tracking registry table and drill-down Profile page featuring Circular Trust Score gauges, operational regions, uploaded documents (Government ID & Selfies), and active listing lists.
8. **`src/components/ListingsView.tsx`**: Real estate flat inventory search and detail pages. Displays multi-tier rent packages (caution fee, agency fee, inspection fee, service charges), eligibility requirements, and dynamic carousel indicators.
9. **`src/components/ReportsView.tsx`**: Operational dispute center detailing fraud investigations, connected evidence attachments (chat snapshots, receipts), historical compliance offenses, and interactive action panels (Banning, Suspending).
10. **`src/components/SubscriptionsView.tsx`**: Agent subscription status tracker managing billing models (₦50,000/yr plans), expired profiles, and renewal modals.
11. **`src/components/SettingsView.tsx`**: Configurations for administrator credentials, system checkboxes preferences, and a form to invite additional operators (appending instantly to the active admin roster).

---

## 🛠️ Administrative Compliance Workflows (Interactive States)

Unlike standard static widgets, every action in this dashboard is fully interactive and modifies the local React state database dynamically:

- **Approve Agent Verification**: Toggling verified on pending folders marks the agent "Verified", rewards a `90` trust score baseline, increments the "Verified Agents" KPI stat, and wipes pending alerts.
- **Ban Agent (Scam protection)**: Banning an agent sets their trust score to `0`, removes all active listings, restricts future posts, and records the event in the notifications tray.
- **Reduce Trust Score Index**: Reduces score metrics by custom penalizing intervals (5, 10, 20, or 50 points index value), updating response times and customer satisfaction progress indicators instantly.
- **Remove Listing**: Triggers a modal for deletion notes and instantly marks the property "Removed", updating dashboard inventory counts in real-time.
- **Renew Subscriptions**: Lets moderators extend expiring premium agent licenses for custom terms (1, 3, 6, or 12 Months), calculating pricing in Naira (₦) and restoring their Active badge of compliance.
- **Invite Admin Operators**: Submitting the administrator email instantly spawns a new profile into the active administrators table roster with designated system rights.

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
   ```

### Running Core Dev Server

Start the fast development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser of choice to view the operational dashboard!

### Production Build compilation

Compile and bundle specialized assets to `/dist` output directory for hosting:
```bash
npm run build
```
The asset compile compiles without warning flags or linter discrepancies.

---

## 📜 Technology Stack Breakdown

- **React 19**: Core framework rendering active layouts & hooks.
- **TypeScript**: Typed contract validation interfaces for bulletproof refactoring.
- **Tailwind CSS**: Utility-first grid systems & custom spacing.
- **Lucide React**: Vector layouts icons closely matching visual weight in mockups.
