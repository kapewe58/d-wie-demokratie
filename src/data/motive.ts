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
		alt: 'Ein großes D in Schwarz-Rot-Gold, darunter „wie Demokratie“ und die Adresse d-wie-demokratie.de, rechts ein QR-Code, in einem Oval wie beim Länderkennzeichen am Auto.',
		// shop: „Zum Shop“ bei diesem Motiv (Design im Spreadshop, Nummer = mainDesignId); eine Fassung kann ein eigenes shop haben
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360830677',
		// weitere Fassungen: Dateien wie oben, nur mit Endung, z. B. d-wie-demokratie-motiv-1-qr-weiss.png / .pdf
		varianten: [
			// mittlerer Ton, damit man das weiße Oval sieht (wie ein Aufkleber auf einem Laptop)
			{ endung: '', name: 'Für alle Untergründe', text: 'Das weiße Oval erinnert an das alte Länderkennzeichen am Auto und wirkt auf jedem Untergrund.', stoff: '#71839b' },
			{
				endung: '-qr-weiss',
				name: 'Für helle Untergründe',
				text: 'Oval durchsichtig, nur hinter dem QR-Code weiß, damit er sich überall scannen lässt.',
			},
			{
				endung: '-farbig',
				name: 'Für mittlere Untergründe',
				versteckt: true,
				text: 'Rand und Schrift weiß, QR-Code auf weißem Feld. Für farbige Textilien wie Blau, Grün oder Grau.',
			},
			{
				endung: '-dunkel',
				name: 'Für dunkle Untergründe',
				text: 'Rand und Schrift weiß, QR-Code auf weißem Feld, dazu ein feiner weißer Rand um das D. Für mittlere und dunkle Farben wie Blau, Grün, Grau oder Schwarz.',
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
			{ endung: '', name: 'Für helle Untergründe', text: 'Schrift und Augen schwarz. Für Papier, Aufkleber und helle Textilien.' },
			{ endung: '-farbig', name: 'Für mittlere Untergründe', versteckt: true, text: 'Schrift und Augen weiß. Für farbige Textilien wie Blau, Grün oder Grau.' },
			{
				endung: '-dunkel',
				name: 'Für dunkle Untergründe',
				shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360830490',
				text: 'Schrift und Augen weiß, dazu ein feiner weißer Rand um die schwarze Ente. Für mittlere und dunkle Farben wie Blau, Grün, Grau oder Schwarz.',
			},
		],
	},
	{
		nr: 3,
		name: 'Vitamin D',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360859901',
		alt: 'Schwarze Johannisbeeren, rote Erdbeeren mit Blüte und goldgelbe Aprikosen mit Blättern, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Vitamin D“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 4,
		name: 'Demokratie braucht Schutz',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360860640',
		alt: 'Eine Schildkröte, deren Panzer in Schwarz, Rot und Gold gestreift ist, blickt wachsam nach vorn, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Schutz“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	{
		nr: 5,
		name: 'Demokratie braucht Stacheln',
		shop: 'https://d-wie-demokratie.myspreadshop.de/all?mainDesignId=360860935',
		alt: 'Ein Igel, dessen Stacheln von Schwarz über Rot zu Gold übergehen, blickt wachsam nach vorn, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Stacheln“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
	},
	// Entwürfe („Kommt bald“): noch ohne Nummer, Download und Shop; stehen unter den fertigen Motiven.
	// id = Sprungmarke (/motive/#<id>), Vorschaubild src/assets/motive/bald/<id>.png.
	// Regel: Eine Nummer bekommt ein Motiv erst, wenn es fertig ist (Druck-PNG da), und zwar die nächste freie,
	// egal in welcher Reihenfolge die Entwürfe fertig werden. Dann bald und id löschen, nr eintragen, PNG ablegen.
	// Auf der Startseite erscheinen Entwürfe nicht.
	{
		id: 'hasen',
		name: 'Keine Angst, Hasen!',
		alt: 'Drei Hasen in Schwarz, Rot und Gold sitzen eng beieinander, der schwarze zeigt den Daumen hoch, der rote zwinkert, der gelbe streckt die Zunge heraus. Darüber „Keine Angst, Hasen!“, darunter d-wie-demokratie.de, in einem runden Abzeichen.',
		bald: true,
	},
	{
		id: 'hut',
		name: 'Alles wird Hut',
		alt: 'Drei Hüte in Schwarz, Rot und Gold: ein schwarzer Zylinder mit rotem Band, eine rote Baskenmütze und ein gelber Hut mit schwarzem Band. Darüber „Alles wird Hut“, darunter d-wie-demokratie.de, in einem runden Abzeichen.',
		bald: true,
	},
	{
		id: 'entchen',
		name: 'Entchen gut, alles gut',
		alt: 'Drei flauschige Entenküken in Schwarz, Rot und Gold sitzen dicht nebeneinander und schnattern fröhlich, gezeichnet im Stil eines alten Kupferstichs. Darüber im Bogen „Entchen gut, alles gut“, darunter d-wie-demokratie.de, in einem Oval.',
		bald: true,
	},
	{
		id: 'chili',
		name: 'Demokratie braucht Schärfe',
		alt: 'Drei Chilischoten in Schwarz, Rot und Gelb liegen schräg und gestaffelt nebeneinander, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Demokratie braucht Schärfe“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
		bald: true,
	},
	{
		id: 'dackel',
		name: 'Dackel lieben Demokratie',
		alt: 'Ein fröhlicher Dackel mit heraushängender Zunge und Ringelschwanz, sein Fell in Schwarz, Rot und Gold gestreift, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Dackel lieben Demokratie“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
		bald: true,
	},
	{
		id: 'amsel',
		name: 'Oh Ei, oh Ei!',
		alt: 'Eine schwarze Amsel singt mit offenem Schnabel, vor ihr liegen ein rotes Ei und ein zerbrochenes Ei mit auslaufendem goldgelbem Eigelb, gezeichnet im Stil eines alten Kupferstichs. Oben im Bogen „Oh Ei, oh Ei!“, unten d-wie-demokratie.de, in einem runden Abzeichen.',
		bald: true,
	},
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
