# Diet Plan Pro

A cross-platform **desktop application** for tracking your daily nutrition, planning weekly meals, and monitoring your weight progress.

Built with **React 18 + Vite** inside **Electron**, packaged as a native installer for Windows, macOS, and Linux.

## Features

- **Dashboard** – Daily calorie ring, macro nutrient bars, water intake tracker, and today's meal summary
- **Meal Planner** – Interactive weekly grid to plan Breakfast, Lunch, Dinner, and Snacks for every day
- **Food Database** – Searchable and filterable database of 30 common foods with full nutritional info
- **My Profile** – Personal details, activity level, weight goals, and automatic TDEE calculation via Mifflin-St Jeor
- **Progress Tracker** – Log weight entries, view a bar chart of recent progress, and track total weight change

All data is stored locally on your machine — no internet or account required.

## Tech Stack

- **Electron 39** — desktop shell
- **React 18 + Vite** — UI framework
- **Tailwind CSS** — styling (emerald/teal theme)
- **React Router** (HashRouter) — client-side routing
- **Lucide React** — icons
- **electron-builder** — cross-platform packaging

## Development

```bash
npm install

# Run in development (Vite dev server + Electron window)
npm run electron:dev

# Build web assets only
npm run build
```

## Build Installers

```bash
npm run electron:build
```

Outputs are placed in the `release/` folder:
- **Windows** → `.exe` installer (NSIS)
- **macOS** → `.dmg`
- **Linux** → `.AppImage`