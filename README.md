This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, setup the correct env variables. You'll find all variables in `.env.example`.

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech-Stack

- NextJS 13 Pages
- Database: PostgreSQL ([https://supabase.com/](supabase.com))
- React Component Library: [https://mantine.dev/](mantine.dev)

## Supabase

Database, Auth and Storage hosted on [https://app.supabase.com/project/yzybkfpayferkdiafjdj](supabase.com).

### Generate database types
1. `npx supabase login`
2. `npx supabase gen types typescript --project-id "YOUR_PROJECTID" > src/lib/database.types.ts`

