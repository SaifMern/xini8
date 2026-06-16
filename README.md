# XINI8 Mock MVP Modules 1–5

Clean, responsive, scalable mocked MVP for XINI8 with LookHu-inspired streaming flow and XINI8 dark green theme.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Push this folder to GitHub and import the repository in Vercel.

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```

## Demo accounts

```txt
creator@xini8.com / 12345678
investor@xini8.com / 12345678
viewer@xini8.com / 12345678
admin@xini8.com / 12345678
```

## Included modules

- Module 1: User Management
- Module 2: Film Lifecycle Engine
- Module 3: Creator Studio Lite
- Module 4: Streaming Platform MVP
- Module 5: Distribution Marketplace Lite

## Local movie images

Movie posters and thumbnails are stored in:

```txt
public/assets/movies/
```

Streaming data is defined in:

```txt
src/shared/data/seedStreaming.js
```

## Video playback

The streaming player supports YouTube embed URLs and HTML5 MP4 fallback URLs. Current seeded media uses YouTube embed URLs with fallback MP4 links for future API-ready migration.

## Reset mock data

If you tested an older version on the same localhost, run this in browser console:

```js
localStorage.clear();
location.reload();
```


## Footer + FAQ Update

- Responsive scalable footer added across public streaming pages and authenticated dashboard pages.
- Same XINI8 logo is used in header/sidebar/footer from `public/assets/xini8-logo.png`.
- Footer links are clickable and route to streaming, projects, distribution, creator studio, profile, login, and dashboard screens.
- Professional XINI8 FAQ accordion/toggle added for product, free/premium content, module coverage, and future API/backend integration clarity.
- Build tested with `npm run build` for Vercel deployment readiness.
