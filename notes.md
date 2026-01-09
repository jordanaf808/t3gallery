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
- [✅] Set up database (Vercel Postgres)
- [✅] Attach database to UI
- [✅] Auth (Clerk)
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

---

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

---

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

---

## Dynamic Routes

With Next.js, when you first hit the webpage it is cached on the server, when you hit refresh, unless anything has changed, you are given a cached response. This is because Next is treating this as a _Static_ page, not _Dynamic_.

To make this a _Dynamic_ page you must do something in the route that is unique to the end user. For example, performing authentication, or grabbing the header info of the http request, these actions return a unique response for each user.

We can also configure the behavior of this route by exporting the `dynamic` variable with the option we want to use:

```js
// prevents route from being cached
export const dynamic = "force-dynamic";
```

[Docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)

---

## DB Schema

Update schema from posts to images

```js
  // Use .notNull() to require that data.
  name: d.varchar("name", { length: 256 }).notNull(),
  //  Add url field and increase length to 1024. We could index this field to filter based on url, but unused db indexes are bad.
  url: d.varchar("url", { length: 1024 }).notNull(),
```

_Note_ It is best to make db changes like this in a dev environment, because this will break production.

---

## Auth

[Install Clerk](https://clerk.com/docs/nextjs/getting-started/quickstart)

Theo mentions Clerk 2 Beta, but that seems to be standard now.

[Add Auth](https://clerk.com/docs/reference/nextjs/clerk-middleware#protect-routes-based-on-authentication-status)

Import ClerkProvider and other auth components into Root Layout

```tsx
<ClerkProvider>
  <html lang="en" className={`font-sans ${geist.variable}`}>
    <body className="flex flex-col gap-4">
      <TopNav>
        <SignedOut>
          <SignInButton />
          <SignUpButton></SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </TopNav>
      {children}
    </body>
  </html>
</ClerkProvider>
```

> Don't forget to add required secrets to local and vercel env files as well.

### Build out TopNav

When you use an underscore `_` in front of the folder name in App Router, it tells the router to not include in routing. This is useful for adding components related to a route.

`src/app/_components`
