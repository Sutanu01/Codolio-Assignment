# Sheet Tracker – Question & Topic Manager

Single-page web app to manage hierarchical questions by **topics** and **sub-topics**: add, edit, delete, and reorder via drag-and-drop. Built for Codolio SDE internship assignment.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & deploy

```bash
npm run build
npm run start
```

Deploy the root to Vercel (no extra config).

## Git

If the repo is not initialized:

```bash
git init
```

## Features

- **Topics** – Add, edit, delete, drag to reorder.
- **Sub-topics** – Same under each topic.
- **Questions** – Add (title + optional link), edit, delete, drag to reorder within a sub-topic.
- Data loads from `/api/sheet` (seeded from `src/data/sample-sheet.ts`). In real scenario, the API would read/write from a database.
