// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://d-wie-demokratie.de',
	integrations: [sitemap()],
	// alte Adresse der Seite, damit bestehende Links weiter funktionieren
	redirects: {
		'/ueber-uns': '/ueber-d-wie-demokratie',
	},
});
