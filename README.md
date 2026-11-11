# Doctor Tracker — Admin

Admin dashboard for managing doctors, patients, hospitals and specializations.
Next.js · React · TanStack Query · Zustand · Tailwind.

**Live:** https://doctor-tracker-admin.vercel.app

## Run locally

Start the [backend](../doctorTracker_backend) first, then:

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

## Environment

| Variable | Local | Vercel |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | `/api` |
| `BACKEND_URL` | — | `http://<server>:5001/api` |

On Vercel, the browser calls `/api` and Vercel forwards it to `BACKEND_URL`,
so an HTTPS site can use an HTTP-only backend. Redeploy after changing either.

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run format`
