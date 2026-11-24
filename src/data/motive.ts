// Unsere Motive, für die Seite /motive/ (alle Motive mit Download und Shop) und die Vorschau auf der Startseite.
//
// Neues Motiv = zwei Dateien ablegen und hier einen Eintrag ergänzen:
//   PNG (4000 px breit, transparent): src/assets/motive/d-wie-demokratie-motiv-<nr>.png  (Vorschaubild und Download)
//   PDF (CMYK, Druckgröße):           public/download/d-wie-demokratie-motiv-<nr>.pdf
// Ein Motiv erscheint erst, wenn sein PNG da ist; fehlen PDF oder Shop-Link, wird nur dieser Link weggelassen.
// Jedes Motiv ist verlinkbar: /motive/#motiv-<nr> (alte Links /#motiv-<nr> leitet die Startseite weiter)
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import type { ImageMetadata } from 'astro';

const liste = [
	{
		nr: 1,
		name: 'D wie Demokratie',
		// Über dieses Motiv (vorerst nur lokal sichtbar, siehe src/data/gestalter.ts):
		// gestalter = id aus gestalter.ts, entstehung = wie es entstanden ist, warum = persönlicher Text (Absätze)
		gestalter: 'klaus-p-wolf',
		entstehung: 'Gezeichnet als Vektorgrafik in Affinity, damit das Motiv in jeder Größe gestochen scharf bleibt, vom kleinen Aufkleber bis zum Banner.',
		warum: [
			'ENTWURF, bitte durch deinen eigenen Text ersetzen: Ich bin mit dem D-Oval am Auto aufgewachsen. Für mich war es immer ein Zeichen von Zugehörigkeit, ganz selbstverständlich und ohne Pathos.',
			'Genau so wünsche ich mir den Umgang mit unseren Farben: selbstverständlich, offen und demokratisch. Darum steht das D hier für das, was uns verbindet: Demokratie.',
		],
		alt: 'Ein großes D in Schwarz-Rot-Gold, darunter „wie Demokratie“ und die Adresse d-wie-demokratie.de, rechts ein QR-Code, in einem Oval wie beim Länderkennzeichen am Auto.',
		// shop: „Zum Shop“ bei diesem Motiv (Design im Spreadshop, Nummer = mainDesignId); eine Fassung kann ein eigenes shop haben
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360830677',
		// weitere Fassungen: Dateien wie oben, nur mit Endung, z. B. d-wie-demokratie-motiv-1-qr-weiss.png / .pdf
		varianten: [
			// mittlerer Ton, damit man das weiße Oval sieht (wie ein Aufkleber auf einem Laptop)
			{ endung: '', name: 'Für jeden Untergrund', text: 'Motiv mit weißem Hintergrund.', stoff: '#71839b' },
			{
				endung: '-qr-weiss',
				name: 'Für hellen Untergrund',
				text: 'Motiv mit transparentem Hintergrund, nur hinter dem QR-Code weiß, damit er sich überall scannen lässt.',
			},
			{
				endung: '-farbig',
				name: 'Für mittleren Untergrund',
				versteckt: true,
				text: 'Rand und Schrift weiß, QR-Code auf weißem Feld. Für farbige Textilien wie Blau, Grün oder Grau.',
			},
			{
				endung: '-dunkel',
				name: 'Für dunklen Untergrund',
				shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360830721',
				text: 'Motiv mit transparentem Hintergrund. Rand und Schrift weiß, QR-Code auf weißem Feld und ein feiner weißer Rand um das D.',
			},
		],
	},
	{
		nr: 2,
		name: 'Drei Entchen für die Demokratie',
		alt: 'Drei Badeenten nebeneinander, gezeichnet in Schwarz, Rot und Gold, darunter die Adresse d-wie-demokratie.de.',
		// eine Fassung erscheint erst, wenn ihr PNG da ist (die schwarze folgt noch)
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360826940',
		varianten: [
			{ endung: '', name: 'Für hellen Untergrund', text: 'Motiv mit transparentem Hintergrund. Schrift und Augen schwarz.' },
			{ endung: '-farbig', name: 'Für mittleren Untergrund', versteckt: true, text: 'Schrift und Augen weiß. Für farbige Textilien wie Blau, Grün oder Grau.' },
			{
				endung: '-dunkel',
				name: 'Für dunklen Untergrund',
				shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360830490',
				text: 'Motiv mit transparentem Hintergrund. Schrift und Augen weiß und ein feiner weißer Rand um die schwarze Ente.',
			},
		],
	},
	{
		nr: 3,
		name: 'Gesunde Vielfalt',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885813',
		alt: 'Schwarze Johannisbeeren, rote Erdbeeren mit Blüte und goldgelbe Aprikosen mit Blättern, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Gesunde Vielfalt“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 4,
		name: 'Demokratie braucht Schutz',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885974',
		alt: 'Eine Schildkröte, deren Panzer in Schwarz, Rot und Gold gestreift ist, blickt wachsam nach vorn, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Schutz“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 5,
		name: 'Demokratie braucht Stacheln',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885979',
		alt: 'Ein Igel, dessen Stacheln von Schwarz über Rot zu Gold übergehen, blickt wachsam nach vorn, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Stacheln“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 6,
		name: 'Demokratie braucht Schärfe',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885892',
		alt: 'Drei Chilischoten in Schwarz, Rot und Gelb liegen schräg und gestaffelt nebeneinander, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Schärfe“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 7,
		name: 'Dackel lieben Demokratie',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885982',
		alt: 'Ein fröhlicher Dackel mit heraushängender Zunge und Ringelschwanz, sein Fell in Schwarz, Rot und Gold gestreift, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Dackel lieben Demokratie“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 8,
		name: 'Farbe bekennen!',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360886012',
		alt: 'Ein fröhlicher Dackel hat drei Farbeimer umgeworfen und sich selbst in Schwarz, Rot und Gold angemalt, um ihn herum laufen schwarze, rote und gelbe Farbpfützen aus. Oben im Bogen „Farbe bekennen!“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 9,
		name: 'Alles wird Hut',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360885891',
		alt: 'Drei Hüte in Schwarz, Rot und Gold: ein schwarzer Zylinder mit rotem Band, eine rote Baskenmütze und ein gelber Hut mit schwarzem Band. Darüber „Alles wird Hut“, darunter d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 10,
		name: 'Keine Angst, Hasen!',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360886023',
		alt: 'Drei Hasen in Schwarz, Rot und Gold sitzen eng beieinander, der schwarze zeigt den Daumen hoch, der rote zwinkert, der gelbe streckt die Zunge heraus. Darüber „Keine Angst, Hasen!“, darunter d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 11,
		name: 'Entchen gut, alles gut',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360861765',
		alt: 'Drei flauschige Entenküken in Schwarz, Rot und Gold sitzen dicht nebeneinander und schnattern fröhlich, gezeichnet im Stil eines alten Kupferstichs. Darüber im Bogen „Entchen gut, alles gut“, darunter d-wie-demokratie.de, in einem Oval.',
	},
	{
		nr: 12,
		name: 'Hinschauen. Zuhören. Mund aufmachen.',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360886052',
		alt: 'Drei Schimpansen mit Halstüchern in Schwarz, Rot und Gold, gezeichnet im Stil eines alten Kupferstichs: Der linke formt mit den Händen ein Fernglas vor den Augen, der mittlere legt die Hände hinter die Ohren, der rechte ruft mit den Händen am Mund. Oben im Bogen „Hinschauen. Zuhören. Mund aufmachen.“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 13,
		name: 'DEMO',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360870008',
		alt: 'Die Buchstaben K, R, A, T, I, E in Schwarz, Rot und Gold laufen auf Armen und Beinen in Turnschuhen nebeneinander her und tragen ein Banner mit der Aufschrift „DEMO“, zusammen „DEMOKRATIE“; ganz links ruft einer durch ein Megafon. Darunter d-wie-demokratie.de.',
		varianten: [
			{ endung: '-dunkel', name: 'Für jeden Untergrund', stoff: '#71839b', shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360869973', text: 'Motiv mit weißem Hintergrund.' },
			{ endung: '', name: 'Für hellen Untergrund', text: 'Motiv mit transparentem Hintergrund.' },
		],
	},
	{
		nr: 14,
		name: 'Schnurren war gestern',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360892112',
		alt: 'Ein brüllender Tigerkopf von vorn im Holzschnitt-Stil, gelb mit schwarzen Streifen, die rote Zunge im weit geöffneten Maul. Darüber „SCHNURREN WAR GESTERN“, darunter d-wie-demokratie.de.',
		varianten: [
			{ endung: '', name: 'Für hellen Untergrund', text: 'Motiv mit transparentem Hintergrund. Schrift schwarz.' },
			{ endung: '-dunkel', name: 'Für dunklen Untergrund', shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360886791', text: 'Motiv mit transparentem Hintergrund. Schrift weiß.' },
		],
	},
	{
		nr: 15,
		name: 'Freie Fahrt für freie Kinder',
		alt: 'Ein Mädchen im Stil einer glänzenden Spielfigur fährt entschlossen auf einem gelben Fahrrad nach rechts; es trägt einen roten Anzug mit Schwarz-Rot-Gold am Ärmel, die schwarzen Zöpfe mit gelben Haargummis wehen im Fahrtwind. Oben im Bogen „Freie Fahrt für freie Kinder“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
		varianten: [
			{ endung: '', name: 'Für jeden Untergrund', stoff: '#71839b', text: 'Motiv mit weißem Hintergrund.' },
			{ endung: '-transparent', name: 'Für hellen Untergrund', text: 'Motiv mit transparentem Hintergrund.' },
		],
	},
	// Entwürfe („Kommt bald“): noch ohne Nummer, Download und Shop; stehen unter den fertigen Motiven.
	// id = Sprungmarke (/motive/#<id>), Vorschaubild src/assets/motive/bald/<id>.png.
	// Regel: Eine Nummer bekommt ein Motiv erst, wenn es fertig ist (Druck-PNG da), und zwar die nächste freie,
	// egal in welcher Reihenfolge die Entwürfe fertig werden. Dann bald und id löschen, nr eintragen, PNG ablegen.
	// Auf der Startseite erscheinen Entwürfe nicht.
];

// stoff: Hintergrund der Vorschau, sonst je nach Endung (dunkel/schwarz) bzw. ein heller Stoffton
// versteckt: true blendet die Fassung aus (Dateien bleiben liegen, zum Zurückholen nur die Zeile löschen)
type Variante = { endung: string; name?: string; text?: string; stoff?: string; versteckt?: boolean; shop?: string };
export const stoff: Record<string, string> = { '-farbig': '#5a7aa3', '-dunkel': '#3d3d3d' };
const pngs = import.meta.glob<{ default: ImageMetadata }>('../assets/motive/d-wie-demokratie-motiv-*.png', { eager: true });
const vorschauen = import.meta.glob<{ default: ImageMetadata }>('../assets/motive/bald/*.png', { eager: true });

// je Motiv die Fassungen, deren PNG da ist; ohne Angabe nur die eine Standardfassung
export const motive = liste
	.map((motiv) => {
		const { bald, id, nr } = motiv as { bald?: boolean; id?: string; nr?: number };
		return {
			...motiv,
			nr: nr ?? 0,
			// Sprungmarke: fertige Motive #motiv-<nr>, Entwürfe #<id>
			anker: bald ? id! : `motiv-${nr}`,
			bald: bald ?? false,
			fassungen: bald
				? [{ endung: '', bild: vorschauen[`../assets/motive/bald/${id}.png`]?.default } as Variante & { bild?: ImageMetadata }]
				: ((motiv as { varianten?: Variante[] }).varianten ?? [{ endung: '' }])
						.map((v: Variante) => ({ ...v, bild: pngs[`../assets/motive/d-wie-demokratie-motiv-${motiv.nr}${v.endung}.png`]?.default }))
						.filter((v) => v.bild && !v.versteckt),
		};
	})
	.filter((motiv) => motiv.fassungen.length > 0 && motiv.fassungen[0].bild);

// ?v= mit einem Fingerabdruck der Datei: ändert sich das PDF, ist es eine neue Adresse und kein Browser zeigt die alte
// Fassung aus seinem Zwischenspeicher (der Server erlaubt dort einen Tag)
export const pdfLink = (nr: number, endung = '') => {
	const datei = `public/download/d-wie-demokratie-motiv-${nr}${endung}.pdf`;
	if (!existsSync(datei)) return '';
	const fingerabdruck = createHash('md5').update(readFileSync(datei)).digest('hex').slice(0, 8);
	return `/download/d-wie-demokratie-motiv-${nr}${endung}.pdf?v=${fingerabdruck}`;
};

// Der Shop liegt bei Spreadshop (Spreadshirt, Non-Profit-Shop: Marge 0) und wird nur verlinkt (pro Motiv bzw. Fassung),
// nicht eingebettet, damit diese Website frei von Cookies und Inhalten Dritter bleibt.
// false: „Zum Shop“ steht bei den Motiven grau und ohne Link da (Shop vorübergehend abgeschaltet)
export const shopAktiv = true;
export const shopStart = 'https://d-wie-demokratie.myspreadshop.de/';
