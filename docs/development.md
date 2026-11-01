# Development

## Backend Configuration

Each Next.js app has its own local backend configuration. Environment files are
ignored and must never be committed.

For normal local-backend development, copy the app's example file to
`.env.local` and set `BACKEND_API_URL`:

```bash
cp apps/platform/.env.example apps/platform/.env.local
cp apps/store/.env.example apps/store/.env.local
```

Next.js loads `.env.local` automatically when its development server starts.
Restart the server after changing the file.

To run against a remote backend, also create `.env.remote` for the relevant
app, set its `BACKEND_API_URL` to the remote URL, and use the
`dev:remote` script. The script explicitly loads `.env.remote`, so its URL
takes precedence over the local value.

## Commands

| App | Local backend | Remote backend | URL |
| --- | --- | --- | --- |
| Platform | `pnpm --dir apps/platform dev` | `pnpm --dir apps/platform dev:remote` | http://localhost:3000 |
| Store | `pnpm --dir apps/store dev` | `pnpm --dir apps/store dev:remote` | http://localhost:3001 |

Both backend URLs use the server-only `BACKEND_API_URL` variable. Do not
prefix it with `NEXT_PUBLIC_`.
