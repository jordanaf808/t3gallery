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

- [ ] Deploy (Vercel)
- [ ] Scaffold basic UI w/ mock data
- [ ] Set up database (Vercel Postgres)
- [ ] Attach database to UI
- [ ] Auth (Clerk)
- [ ] Image Upload
- [ ] Error Management (Sentry)
- [ ] Routing/Image page (parallel routes in new Next App Router)
- [ ] Delete button (Server Actions)
- [ ] Analytics (Posthog)
- [ ] Ratelimiting (Upstash)
