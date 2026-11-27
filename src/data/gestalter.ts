// Gestalterinnen und Gestalter unserer Motive. Jede Person hat eine eigene Seite /gestalter/<id>/,
// die automatisch alle ihre Motive zeigt (Feld `gestalter` in src/data/motive.ts).
// Andere Personen nur mit schriftlicher Einwilligung aufnehmen (Name, Foto, Text, Link); bei Kindern nur Vorname
// und Klasse/Schule, kein Foto, Einwilligung der Eltern.
// SICHTBARKEIT: seit 2026-11-25 öffentlich; `gestalterAktiv = import.meta.env.DEV` blendet es wieder aus (nur lokal).
import type { ImageMetadata } from 'astro';
import portraitKlaus from '../assets/klaus-p-wolf.jpg';

export const gestalterAktiv = true;

export type Gestalter = {
	id: string;
	name: string;
	// eine Zeile unter dem Namen
	kurz?: string;
	bild?: ImageMetadata;
	// eigene Homepage (öffnet in neuem Tab)
	url?: string;
	// Absätze über die Person
	text?: string[];
};

export const gestalter: Gestalter[] = [
	{
		id: 'klaus-p-wolf',
		name: 'Klaus P. Wolf',
		kurz: 'Initiator von d-wie-demokratie.de',
		bild: portraitKlaus,
		url: 'https://5-finger.com',
		text: [
			'Klaus P. Wolf wurde 1958 in München geboren und studierte dort Jura. Nach kurzer Zeit als Anwalt widmete er sich ganz der Fotografie. Als Tier-, Natur- und Reisefotografen bereisen seine Frau und er seitdem die Welt. 2003 gründete er die Bildagentur imageBROKER.com, die mittlerweile sein Sohn leitet. Momentan schreibt er auf 5-finger.com an seinem ersten Buch.',
			'Er hat einiges von der Welt gesehen und lebt sehr gerne in unserem wunderbaren Land. Er ist in keiner politischen Partei.',
		],
	},
	// NUR LOKAL: gehört zum Entwurf „Deutschlandfunk statt Verschwörungsschund“ in motive.ts
	...(import.meta.env.DEV
		? [
				{
					id: 'deutschlandfunk',
					name: 'Deutschlandfunk Kultur',
					kurz: 'Sendung „Kompressor“',
					url: 'https://www.deutschlandfunkkultur.de/',
				},
			]
		: []),
];

export const gestalterVon = (id?: string) => gestalter.find((g) => g.id === id);
