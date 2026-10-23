# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website for the initiative *D wie Demokratie*, built with Astro. Published at https://d-wie-demokratie.de. All content is in German. The site's purpose: present the "D wie Demokratie" sticker and let people download it (reprinting is explicitly encouraged).

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

- `src/layouts/Layout.astro`: shared `<head>`, black-red-gold stripe at the top, footer links. Global CSS variables live here.
- `src/pages/index.astro`: landing page with the sticker and download button.
- `src/pages/impressum.astro`, `src/pages/datenschutz.astro`: legal pages.
- `src/assets/aufkleber.png`: sticker image shown on the page (optimized by Astro).
- `public/aufkleber-d-wie-demokratie.png`: the same sticker as the download file.

## Design conventions

Colors (CSS variables in `Layout.astro`): `--schwarz: #000000`, `--rot: #dd0000`, `--gold: #ffce00`. Font: system Helvetica/Arial stack, matching the sticker. Content max-width: 680 px.
