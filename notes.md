# [The Modern React Tutorial](https://www.youtube.com/watch?v=d5x0JCZbAJs)

## From 0 To Production

### (RSCs, Next.js, Shadui, Drizzle, TS and more)

## Init (3:30)

Use `pnpm create t3-app@latest` with Typescript, but not tRPC or Auth at this point.

On first run I got this error

```sh
 ⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/jordan/yarn.lock as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles:
   * /Users/jordan/Dev/NextJSBootcamp/modern-react-tutorial/t3gallery/pnpm-lock.yaml
   * /Users/jordan/Dev/pnpm-lock.yaml
```

After a google search I found that adding this code to the `next.config.js` file resolved that conflict. [source](https://github.com/vercel/next.js/issues/81864)

```js
/**
 * @type {import('next').NextConfig}
 */
const config = {
  outputFileTracingRoot: import.meta.dirname,
};
```

## To-Do List

- [✅] Deploy (Vercel)
- [✅] Scaffold basic UI w/ mock data
- [✅] Tidy up build process
- [ ] Set up database (Vercel Postgres)
- [ ] Attach database to UI
- [ ] Auth (Clerk)
- [ ] Image Upload
- [ ] Error Management (Sentry)
- [ ] Routing/Image page (parallel routes in new Next App Router)
- [ ] Delete button (Server Actions)
- [ ] Analytics (Posthog)
- [ ] Ratelimiting (Upstash)

---

## Deploy App and Basic UI

Adjusted Vercel/Github permissions to add t3gallery repo.

add temp db env value to vercel to meet deploy requirements

register UploadThing account to manage images

add top nav component, add mock-image data, show images on homepage

## Tidy Up Build Process

### Ignore Typescript and ESLint errors during build.

Instead of blocking our build process with these errors, handle these errors separately.

```js
/** @type {import("next").NextConfig} */
const config = {
  outputFileTracingRoot: import.meta.dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
```

### TurboPack

Add `--turbo` flag to run project even faster

> "Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js. You can use Turbopack with both the Pages and App Router for a much faster local development experience." [docs](https://nextjs.org/docs/app/api-reference/turbopack)

## Set Up Database

Create and connect DB to this project

Select from variety of db providers

I chose Neon (similar to the tutorial) and create env variable POSTGRES_URL

Change Vercel and DB location to Portland

Copy Drizzle ORM code snippet from Vercel/Neon storage setup into `server/index.ts` (see code snippet below to see my modified version)

```ts
// src/server/db/index.ts
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

// updated env reference for clarity
// const sql = neon(process.env.DATABASE_URL!);
const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle({ client: sql, schema: schema });
```

Install missing packages for snippet above

- `pnpm install @neondatabase/serverless`

- `pnpm i dotenv`

Push DB

`pnpm run db:push`

Go to DB Dashboard

`pnpn db:studio`

### Fetch items from DB

```tsx
export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log("//// POSTS: ", posts); // But wait... this doesn't print to the console???
  //...
}
```

This function is actually run on the server!

Previously in React, using SSR, your components ran on the server and the client, now with Server Components it only runs on the server.
