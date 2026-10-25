// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://d-wie-demokratie.de',
	// die Statistik-Einstellung gehört nicht in Suchmaschinen
	integrations: [sitemap({ filter: (seite) => !seite.includes('/statistik/') })],
	// alte Adressen der Seite, damit bestehende Links weiter funktionieren
	redirects: {
		'/ueber-uns': '/haeufige-fragen',
		'/ueber-d-wie-demokratie': '/haeufige-fragen',
	},
});
