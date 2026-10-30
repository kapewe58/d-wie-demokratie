# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website for the initiative *D wie Demokratie*, built with Astro. Published at https://d-wie-demokratie.de. All content is in German. The site's purpose: present the "D wie Demokratie" sticker and the initiative behind it, and get people to share it.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # build to ./dist/
npm run preview  # preview the built site locally
```

No test suite exists.

## Deployment

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`), which builds and rsyncs `dist/` to `/var/www/d-wie-demokratie/` on the same Hetzner server as 5-finger.com (nginx config: `/etc/nginx/sites-available/d-wie-demokratie`, HTTPS via certbot).

## Architecture

- `src/layouts/Layout.astro`: shared `<head>` (meta, Open Graph, Umami script), sticky header with black-red-gold stripe and tab navigation, footer links. Global CSS variables live here. Also holds the tab order (`reiter`) used for swiping between tabs on mobile and for the slide animation (native cross-document View Transitions); a new tab must be added there as well as in the nav.
- `src/pages/index.astro`: landing page with the sticker and links to Art. 1–5 GG.
- `src/pages/haeufige-fragen.astro`: FAQ page, including who started the initiative; the biography with portrait (`src/assets/klaus-p-wolf.jpg`) is collapsed until the name is clicked (open without JavaScript).
- `src/pages/mitmachen.astro`: "Mitmachen" page (who we are looking for); formerly `/unterstuetzer/`, which redirects here.
- `src/pages/jobs.astro`: volunteer job postings, kept as the `stellen` array at the top (empty array shows a "nothing open" note); each posting is linkable via `/jobs/#<id>`. Uses "du", unlike the rest of the site ("Sie").
- `src/pages/sag-es-weiter.astro`: share buttons (WhatsApp, e-mail, copy link, native share).
- `src/pages/impressum.astro`, `src/pages/datenschutz.astro`: legal pages.
- `src/pages/statistik.astro`: opt-out toggle for the visitor statistics (`noindex`, excluded from the sitemap).
- `src/middleware.ts`: wraps every "d-wie-demokratie.de" in visible text in `.nobr` so it never breaks at the hyphens.
- `src/assets/aufkleber.png`: sticker image shown on the page (optimized by Astro).
- `public/aufkleber-d-wie-demokratie.png`: the same sticker, used as the Open Graph preview image.
- `src/assets/d-wie-demokratie-logo.png`: logo in the header.
- `public/manifest.json`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`: home-screen web app (name "Demokratie", standalone). The smaller icons are scaled from `icon-512.png`.

## Statistics

Umami, self-hosted at https://stats.5-finger.com (same server as 5-finger.com; setup documented in the 5-finger repo under `deploy/umami/`). The script in `Layout.astro` only counts on `d-wie-demokratie.de` (`data-domains`), not on localhost. Opt-out sets `localStorage['umami.disabled'] = '1'` via `/statistik/`. Click events use `data-umami-event` attributes (share buttons on "Sag's weiter", support e-mail links, job application e-mail links `email-job`); opening the biography on the FAQ page is counted via `umami.track('lebenslauf-aufklappen')`. If what is collected changes, update section 3 of `datenschutz.astro`.

## Design conventions

Colors (CSS variables in `Layout.astro`): `--schwarz: #000000`, `--rot: #dd0000`, `--gold: #ffce00`. Font: system Helvetica/Arial stack, matching the sticker. Content max-width: 680 px.
