import { defineMiddleware } from 'astro:middleware';

// „d-wie-demokratie.de“ (auch als info@…) soll nie an den Bindestrichen umbrechen.
// Statt jede Stelle im Text einzeln einzupacken, geschieht das hier beim Erzeugen jeder Seite,
// damit auch künftig geschriebene Texte automatisch erfasst werden.
const NAME = /(?:[\w.+-]+@)?d-wie-demokratie\.de/g;

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();
	if (!response.headers.get('content-type')?.includes('text/html')) return response;

	const html = await response.text();
	const start = html.indexOf('<body');
	if (start === -1) return new Response(html, response);

	// Nur sichtbaren Text im <body> anfassen: Tags (mit Attributen wie href) und
	// der Inhalt von <script>/<style> bleiben unverändert.
	const teile = html.slice(start).split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/);
	const body = teile
		.map((teil) => (teil.startsWith('<') ? teil : teil.replace(NAME, '<span class="nobr">$&</span>')))
		.join('');

	return new Response(html.slice(0, start) + body, response);
});
