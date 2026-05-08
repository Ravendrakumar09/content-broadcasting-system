# Content Broadcasting System (Frontend)

A role-based frontend for educational content broadcasting built with Next.js + Tailwind CSS.

## Features

- Authentication with role-based redirects (Teacher / Principal)
- Protected route handling with middleware + client auth checks
- Teacher workflows:
  - Dashboard with status cards
  - Upload content with file validation and preview
  - My Content table with schedule + approval status
- Principal workflows:
  - Dashboard with global stats
  - Pending approval page with approve/reject actions
  - Mandatory rejection reason modal
  - All content page with search + status filters
- Public live page:
  - Route: `/live/:teacherId`
  - Shows currently active approved content
  - Loading, empty, and error states
  - Auto-refresh polling (30s)
- Dedicated service layer for API calls (`app/services/*`)

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Axios
- json-server (mock backend)

## Folder Structure (Key)

- `app/components` reusable UI, forms, and dashboards
- `app/services` API integration layer
- `app/hooks` reusable data/auth hooks
- `app/context` auth context
- `app/utils` formatting, storage, file validation helpers
- `app/validations` form validation logic

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start mock API server:

```bash
npm run api
```

3. In another terminal, start frontend:

```bash
npm run dev
```

4. Open:

- Frontend: `http://localhost:3000`
- Mock API: `http://127.0.0.1:5500`

## API Connection Notes

- Frontend requests default to `http://127.0.0.1:5500` (direct to mock API).
- Optional overrides:
  - Set `NEXT_PUBLIC_API_BASE_URL` to any API base URL.
  - Set `API_SERVER_URL` for server-side/default fallback.
  - Example: `NEXT_PUBLIC_API_BASE_URL=http://192.168.1.20:5500 npm run dev`

## Demo Credentials

- Teacher: `teacher@test.com` / `123456`
- Principal: `principal@test.com` / `123456`

## Build & Checks

- Lint:

```bash
npm run lint
```

- Production build (webpack mode for restricted environments):

```bash
npx next build --webpack
```

## Notes

- File upload accepts only JPG/PNG/GIF, max 10MB.
- Uploaded files are stored as data URLs in `db.json` (mock flow).
- Scheduling status labels are UI-driven: Scheduled / Active / Expired.
