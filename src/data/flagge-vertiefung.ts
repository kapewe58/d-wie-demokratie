// Ausführliche Texte für „Noch mehr erfahren“ auf der Seite „Kleine Geschichte unserer Flagge“
// (src/pages/geschichte-unserer-flagge.astro). Schlüssel ist die Jahreszahl der Station.
// Bausteine: Zwischentitel, Absatz, Bild, Flaggen (mehrere kleine Flaggen nebeneinander), Zitat.
// Bilder von Wikimedia Commons, lokal abgelegt; Nachweis und Lizenz stehen beim Bild und in den Bildnachweisen.
import type { ImageMetadata } from 'astro';
import luetzow from '../assets/flagge/mehr-1813-luetzow.jpg';
import barrikade from '../assets/flagge/mehr-1848-barrikade.jpg';
import flaggeKaiserreich from '../assets/flagge/mehr-flagge-kaiserreich.png';
import flaggeWeimar from '../assets/flagge/mehr-flagge-weimar.png';
import flaggeHandel from '../assets/flagge/mehr-flagge-handel.png';
import flaggeWirmer from '../assets/flagge/mehr-flagge-wirmer.png';
import flaggeDdr from '../assets/flagge/mehr-flagge-ddr.png';
import leipzig from '../assets/flagge/mehr-1989-leipzig.jpg';

export const lizenz = {
	gemeinfrei: { text: 'gemeinfrei', url: '' },
	ccBySa30: { text: 'CC BY-SA 3.0', url: 'https://creativecommons.org/licenses/by-sa/3.0/deed.de' },
	ccBySa30De: { text: 'CC BY-SA 3.0 DE', url: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.de' },
};

export type Bild = {
	src: ImageMetadata;
	alt: string;
	unterschrift: string;
	nachweis: string;
	lizenz: { text: string; url: string };
	quelle: string;
	// Hochformat: schmaler darstellen
	hoch?: boolean;
};

export type Flagge = {
	src: ImageMetadata;
	name: string;
	zeit: string;
	alt: string;
	quelle: string;
};

export type Baustein =
	| { art: 'titel'; text: string }
	| { art: 'absatz'; text: string }
	| { art: 'bild'; bild: Bild }
	| { art: 'flaggen'; flaggen: Flagge[] }
	| { art: 'zitat'; text: string; herkunft: string };

const flagge = {
	kaiserreich: {
		src: flaggeKaiserreich,
		name: 'Kaiserreich',
		zeit: '1871–1918',
		alt: 'Flagge mit drei waagerechten Streifen: Schwarz, Weiß, Rot.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Flag_of_Germany_(1867%E2%80%931918).svg',
	},
	weimar: {
		src: flaggeWeimar,
		name: 'Reichsflagge der Republik',
		zeit: '1919–1933',
		alt: 'Flagge mit drei waagerechten Streifen: Schwarz, Rot, Gold.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Flag_of_Germany_(3-2).svg',
	},
	handel: {
		src: flaggeHandel,
		name: 'Handelsflagge der Republik',
		zeit: '1919–1933',
		alt: 'Flagge in Schwarz, Weiß, Rot mit einem kleinen schwarz-rot-goldenen Feld in der oberen Ecke am Mast.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Merchant_flag_of_Germany_(1919%E2%80%931933).svg',
	},
	wirmer: {
		src: flaggeWirmer,
		name: 'Entwurf von Josef Wirmer',
		zeit: '1944',
		alt: 'Flagge mit einem schwarzen, gold umrandeten Kreuz auf rotem Grund.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Proposed_German_National_Flag_1944.svg',
	},
	bund: {
		src: flaggeWeimar,
		name: 'Bundesrepublik',
		zeit: 'seit 1949',
		alt: 'Flagge mit drei waagerechten Streifen: Schwarz, Rot, Gold.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Flag_of_Germany_(3-2).svg',
	},
	ddr: {
		src: flaggeDdr,
		name: 'DDR',
		zeit: '1959–1990',
		alt: 'Flagge in Schwarz, Rot, Gold mit dem Staatswappen der DDR in der Mitte: Hammer und Zirkel im Ährenkranz.',
		quelle: 'https://commons.wikimedia.org/wiki/File:Flag_of_East_Germany.svg',
	},
} satisfies Record<string, Flagge>;

export const vertiefung: Record<string, Baustein[]> = {
	'1815': [
		{ art: 'titel', text: 'Krieg gegen Napoleon' },
		{
			art: 'absatz',
			text: 'Anfang des 19. Jahrhunderts beherrscht Napoleon große Teile Europas. 1806 zerfällt das Heilige Römische Reich Deutscher Nation, das jahrhundertelang hunderte Fürstentümer und Städte unter einem Dach vereint hatte. 1813 erheben sich Preußen und seine Verbündeten gegen die französische Herrschaft.',
		},
		{
			art: 'absatz',
			text: 'Tausende junge Männer melden sich freiwillig, darunter viele Studenten. Sie hoffen auf mehr als die Vertreibung Napoleons: auf ein geeintes Deutschland, in dem Bürger mitreden dürfen.',
		},
		{
			art: 'bild',
			bild: {
				src: luetzow,
				alt: 'Gemälde: Reiter in schwarzen Uniformen mit hohen Mützen galoppieren mit gezogenen Säbeln über ein Feld.',
				unterschrift: '„Lützows wilde verwegene Jagd“: Reiter des Lützowschen Freikorps in ihren schwarzen Uniformen',
				nachweis: 'Richard Knötel, um 1900',
				lizenz: lizenz.gemeinfrei,
				quelle: 'https://commons.wikimedia.org/wiki/File:Luetzows_verwegene_jagd_aquarellreproduktion_1900.jpg',
			},
		},
		{
			art: 'absatz',
			text: 'Am bekanntesten wird das Lützowsche Freikorps. Weil die Freiwilligen ihre eigene Kleidung mitbrachten, ließ man sie einheitlich schwarz färben. Dazu kamen rote Aufschläge und messingfarbene Knöpfe: Schwarz, Rot und Gold. Der Dichter Theodor Körner, selbst Lützower, besang die Truppe in seinem Lied „Lützows wilde verwegene Jagd“. Er fiel 1813 mit 21 Jahren.',
		},
		{ art: 'titel', text: 'Enttäuschte Hoffnungen' },
		{
			art: 'absatz',
			text: 'Nach dem Sieg über Napoleon ordnen die Fürsten Europa auf dem Wiener Kongress 1815 neu. Statt eines geeinten Deutschlands entsteht der Deutsche Bund, ein loser Zusammenschluss von fast 40 Einzelstaaten. Die Fürsten behalten ihre Macht, Verfassungen und Mitbestimmung gibt es kaum.',
		},
		{
			art: 'absatz',
			text: 'Viele heimgekehrte Freiwillige sind enttäuscht. Am 12. Juni 1815 gründen Studenten in Jena die Urburschenschaft. Neu daran: Sie schließen sich über die Grenzen ihrer Herkunftsländer hinweg zusammen, als Deutsche. Ihre Farben Rot und Schwarz mit Gold werden zum Zeichen der jungen Bewegung.',
		},
		{ art: 'titel', text: 'Das Wartburgfest' },
		{
			art: 'absatz',
			text: 'Am 18. Oktober 1817 treffen sich rund 500 Studenten auf der Wartburg bei Eisenach. Sie feiern 300 Jahre Reformation und den vierten Jahrestag der Völkerschlacht bei Leipzig, bei der Preußen, Österreich, Russland und Schweden im Oktober 1813 Napoleon entscheidend besiegten. Viele der Studenten hatten selbst in den Befreiungskriegen gegen ihn gekämpft. Sie fordern Einheit und Verfassung.',
		},
		{ art: 'titel', text: 'Verboten' },
		{
			art: 'absatz',
			text: '1819 ermordet der Burschenschafter Karl Ludwig Sand den Schriftsteller August von Kotzebue. Kotzebue hatte die Burschenschaften verspottet und berichtete dem russischen Zaren über die Lage in Deutschland. Für Sand ist er deshalb ein Verräter. Der österreichische Staatskanzler Metternich nutzt die Tat: Mit den Karlsbader Beschlüssen werden die Burschenschaften verboten, Zeitungen zensiert und die Universitäten überwacht. Schwarz-Rot-Gold wird zum Zeichen der Opposition, das man oft nur heimlich trägt.',
		},
		{
			art: 'zitat',
			text: 'Aus der Schwärze der Knechtschaft durch blutige Schlachten ans goldene Licht der Freiheit.',
			herkunft: 'Eine verbreitete, spätere Deutung der drei Farben',
		},
	],
	'1832': [
		{ art: 'titel', text: 'Aufbruch nach 1830' },
		{
			art: 'absatz',
			text: 'Im Juli 1830 stürzen die Pariser ihren König. Im selben Jahr erheben sich die Polen gegen die russische Herrschaft. Ihr Aufstand scheitert, und Tausende polnische Flüchtlinge ziehen durch Deutschland, wo sie vielerorts begeistert empfangen werden.',
		},
		{
			art: 'absatz',
			text: 'Besonders groß ist die Unzufriedenheit in der Pfalz, die damals zu Bayern gehört: Die Menschen leiden unter hohen Abgaben, Zöllen und der Zensur.',
		},
		{ art: 'titel', text: 'Ein Volksfest als Protest' },
		{
			art: 'absatz',
			text: 'Die Journalisten Philipp Jakob Siebenpfeiffer und Johann Georg August Wirth laden zu einem „Fest“ ein, denn politische Versammlungen sind verboten. Am 27. Mai 1832 ziehen 20.000 bis 30.000 Menschen auf das Hambacher Schloss: Handwerker, Bauern, Studenten, Bürger und ausdrücklich auch Frauen. Neben Schwarz-Rot-Gold wehen polnische Fahnen.',
		},
		{
			art: 'absatz',
			text: 'In den Reden geht es um Volkssouveränität, Pressefreiheit und ein geeintes Deutschland, aber auch um ein Europa freier Völker.',
		},
		{
			art: 'zitat',
			text: 'Hoch! dreimal hoch leben die vereinigten Freistaaten Deutschlands! Hoch! dreimal hoch das conföderirte republikanische Europa!',
			herkunft: 'Johann Georg August Wirth in seiner Rede auf dem Hambacher Fest',
		},
		{ art: 'titel', text: 'Die Antwort der Fürsten' },
		{
			art: 'absatz',
			text: 'Die Fürsten reagieren mit Härte. Der Deutsche Bund verbietet politische Vereine und Volksversammlungen und auch das Tragen schwarz-rot-goldener Abzeichen. Siebenpfeiffer und Wirth werden verhaftet. Siebenpfeiffer gelingt die Flucht in die Schweiz.',
		},
		{ art: 'titel', text: 'Die Fahne von Hambach' },
		{
			art: 'absatz',
			text: 'Eine der Fahnen, die 1832 auf das Schloss getragen wurden, ist erhalten. Auf dem mittleren Streifen steht „Deutschlands Wiedergeburt“. Sie ist heute im Hambacher Schloss ausgestellt, das als Wiege der deutschen Demokratie gilt und besucht werden kann.',
		},
	],
	'1848': [
		{ art: 'titel', text: 'Der Funke aus Paris' },
		{
			art: 'absatz',
			text: 'Im Februar 1848 rufen die Pariser erneut die Republik aus. Im März springt der Funke auf die deutschen Staaten über. Überall werden die „Märzforderungen“ laut: Pressefreiheit, Schwurgerichte, Volksbewaffnung und ein gewähltes gesamtdeutsches Parlament. Viele Fürsten geben nach und ernennen liberale Regierungen.',
		},
		{
			art: 'bild',
			bild: {
				src: barrikade,
				alt: 'Farbige Lithografie: Nachts stehen Menschen auf einer Barrikade aus Holz und Pflastersteinen und schwenken große schwarz-rot-goldene Fahnen, im Hintergrund Häuser mit weiteren Fahnen.',
				unterschrift: 'Barrikadenkämpfe in Berlin in der Nacht vom 18. auf den 19. März 1848',
				nachweis: 'Zeitgenössische Lithografie, Verlag Winckelmann, Berlin',
				lizenz: lizenz.gemeinfrei,
				quelle: 'https://commons.wikimedia.org/wiki/File:Erinnerung_an_den_Befreiungskampf_(M%C3%A4rzrevolution)_1848.png',
			},
		},
		{
			art: 'absatz',
			text: 'In Berlin kommt es am 18. März zu blutigen Barrikadenkämpfen, fast 300 Menschen sterben. König Friedrich Wilhelm IV. lässt die Truppen abziehen und verneigt sich vor den Toten. Am 21. März reitet er mit einer schwarz-rot-goldenen Armbinde durch die Stadt. Die Farben der Verbotenen sind plötzlich die Farben der Zukunft.',
		},
		{ art: 'titel', text: 'Das erste gesamtdeutsche Parlament' },
		{
			art: 'absatz',
			text: 'Am 18. Mai 1848 tritt in der Frankfurter Paulskirche die Nationalversammlung zusammen, gewählt von Männern aus allen deutschen Staaten. Unter den Abgeordneten sind so viele Juristen und Professoren, dass man vom „Professorenparlament“ spricht. Frauen dürfen nicht wählen, verfolgen die Debatten aber von einer eigenen Galerie aus.',
		},
		{
			art: 'absatz',
			text: 'Im Dezember 1848 beschließt das Parlament die „Grundrechte des deutschen Volkes“: Gleichheit vor dem Gesetz, Freiheit der Person, Meinungs-, Presse-, Versammlungs- und Glaubensfreiheit. Die Vorrechte des Adels sollen fallen, die Todesstrafe wird abgeschafft.',
		},
		{ art: 'titel', text: 'Gescheitert – und doch nicht vergeblich' },
		{
			art: 'absatz',
			text: 'Am 28. März 1849 verabschiedet die Nationalversammlung eine Verfassung für ein geeintes Deutschland. Doch der preußische König lehnt die angebotene Kaiserkrone ab, er will keine Krone aus der Hand eines Parlaments. Aufstände für die Verfassung in Sachsen, Baden und der Pfalz werden niedergeschlagen, im Juli 1849 fällt die Festung Rastatt. Tausende Demokraten fliehen, viele nach Amerika.',
		},
		{
			art: 'absatz',
			text: 'Die Ideen aber bleiben: Die Grundrechte der Paulskirche sind das Vorbild für die Weimarer Verfassung von 1919 und für unser Grundgesetz von 1949.',
		},
	],
	'1919': [
		{ art: 'titel', text: 'Schwarz-Weiß-Rot oder Schwarz-Rot-Gold?' },
		{
			art: 'absatz',
			text: 'Das 1871 gegründete Kaiserreich hatte nicht Schwarz-Rot-Gold gewählt, sondern Schwarz-Weiß-Rot: die Farben Preußens und der Hansestädte. Nach der Revolution vom November 1918 tritt 1919 die Nationalversammlung in Weimar zusammen und muss entscheiden, unter welchen Farben die neue Republik stehen soll.',
		},
		{ art: 'flaggen', flaggen: [flagge.kaiserreich, flagge.weimar, flagge.handel] },
		{
			art: 'absatz',
			text: 'Das Ergebnis ist ein Kompromiss: Die Reichsfarben sind Schwarz-Rot-Gold. Die Handelsflagge der Schiffe bleibt Schwarz-Weiß-Rot, mit den Reichsfarben in der oberen Ecke am Mast.',
		},
		{
			art: 'absatz',
			text: 'Für die Gegner der Republik bleibt Schwarz-Weiß-Rot ihre Fahne. Schwarz-Rot-Gold verhöhnen sie als „Schwarz-Rot-Senf“. Wie umkämpft die Farben sind, zeigt 1926: Weil Reichskanzler Hans Luther anordnet, dass Gesandtschaften im Ausland auch die Handelsflagge hissen sollen, stürzt seine Regierung im Reichstag.',
		},
		{ art: 'titel', text: 'Das Reichsbanner' },
		{
			art: 'absatz',
			text: 'Am 22. Februar 1924 gründen Sozialdemokraten, Mitglieder der katholischen Zentrumspartei und Liberale in Magdeburg das „Reichsbanner Schwarz-Rot-Gold“. Es schützt demokratische Versammlungen gegen Angriffe von rechts und links und organisiert jedes Jahr am 11. August, dem Verfassungstag, große Feiern. Mit weit über einer Million Mitgliedern wird es zu einer der größten Massenorganisationen der Republik.',
		},
		{
			art: 'absatz',
			text: '1933 wird das Reichsbanner verboten. Viele Mitglieder werden verfolgt, einige gehen in den Widerstand.',
		},
	],
	'1933–1935': [
		{ art: 'titel', text: 'Die Flagge als erstes Opfer' },
		{
			art: 'absatz',
			text: 'Am 30. Januar 1933 wird Adolf Hitler Reichskanzler. Schon sechs Wochen später, am 12. März 1933, ordnet Reichspräsident Hindenburg an, dass vorläufig Schwarz-Weiß-Rot und die Hakenkreuzflagge gemeinsam zu hissen sind. Schwarz-Rot-Gold verschwindet aus dem öffentlichen Leben. Die Nationalsozialisten hatten die Farben der Republik jahrelang verhöhnt.',
		},
		{
			art: 'absatz',
			text: 'Vielerorts verbrennen Nationalsozialisten die schwarz-rot-goldenen Fahnen öffentlich, als Zeichen dafür, dass die Republik am Ende ist. So etwa am 13. März 1933 in Bornhöved in Schleswig-Holstein, worüber am nächsten Tag die Lokalzeitung berichtet.',
		},
		{
			art: 'absatz',
			text: 'Am 15. September 1935 beschließt der Reichstag auf dem Parteitag in Nürnberg das Reichsflaggengesetz, am selben Tag wie die antisemitischen „Nürnberger Gesetze“. Die Hakenkreuzflagge wird alleinige Reichs- und Nationalflagge.',
		},
		{ art: 'titel', text: 'Im Verborgenen' },
		{
			art: 'absatz',
			text: 'Parteien, Gewerkschaften und das Reichsbanner werden zerschlagen, ihre Mitglieder verhaftet oder ins Exil getrieben. Schwarz-Rot-Gold lebt im Exil und im Widerstand weiter.',
		},
		{
			art: 'absatz',
			text: 'Der Jurist Josef Wirmer, einer der Verschwörer des 20. Juli 1944, entwirft für ein Deutschland nach Hitler eine Fahne mit einem schwarzen, gold umrandeten Kreuz auf rotem Grund. Nach dem gescheiterten Attentat wird er im September 1944 hingerichtet.',
		},
		{ art: 'flaggen', flaggen: [flagge.wirmer] },
	],
	'1949': [
		{ art: 'titel', text: 'Der Parlamentarische Rat' },
		{
			art: 'absatz',
			text: 'Am 1. September 1948 tritt in Bonn der Parlamentarische Rat zusammen: 65 Abgeordnete aus den Landtagen der drei westlichen Besatzungszonen, Präsident ist Konrad Adenauer. Sie erarbeiten das Grundgesetz, bewusst als Gegenentwurf zur Diktatur und mit den Lehren aus dem Scheitern von Weimar.',
		},
		{
			art: 'absatz',
			text: 'Unter ihnen sind vier Frauen, die „Mütter des Grundgesetzes“: Elisabeth Selbert, Frieda Nadig, Helene Weber und Helene Wessel. Gegen viele Widerstände setzt Elisabeth Selbert den Satz durch: „Männer und Frauen sind gleichberechtigt.“',
		},
		{ art: 'titel', text: 'Welche Flagge?' },
		{
			art: 'absatz',
			text: 'Auch über die Flagge wird beraten. Vorgeschlagen wird unter anderem die Kreuzfahne des Widerstandskämpfers Josef Wirmer. Die Mehrheit entscheidet sich für die Trikolore von 1848 und 1919, um bewusst an die demokratische Tradition anzuknüpfen.',
		},
		{
			art: 'absatz',
			text: 'Die Wirmer-Fahne wird heute übrigens auch von Rechtsextremen gezeigt, ein weiteres Beispiel dafür, wie Symbole der Demokratie vereinnahmt werden.',
		},
		{ art: 'titel', text: 'Zwei Staaten, gleiche Farben' },
		{
			art: 'absatz',
			text: 'Auch die am 7. Oktober 1949 gegründete DDR wählt Schwarz-Rot-Gold. Zehn Jahre lang sind die Flaggen beider deutscher Staaten gleich. 1959 setzt die DDR ihr Staatswappen in die Mitte: Hammer, Zirkel und Ährenkranz. Bei den Olympischen Spielen 1960 und 1964 treten beide Staaten noch gemeinsam an, unter Schwarz-Rot-Gold mit den olympischen Ringen.',
		},
		{ art: 'flaggen', flaggen: [flagge.bund, flagge.ddr] },
	],
	'1990': [
		{ art: 'titel', text: 'Die Friedliche Revolution' },
		{
			art: 'absatz',
			text: 'Im Herbst 1989 gehen in der DDR Hunderttausende auf die Straße, allen voran in Leipzig bei den Montagsdemonstrationen. Ihr Ruf „Wir sind das Volk!“ wird später zu „Wir sind ein Volk!“. Viele schneiden das Staatswappen aus ihren DDR-Fahnen: Schwarz-Rot-Gold mit einem Loch in der Mitte wird zum Zeichen der Friedlichen Revolution.',
		},
		{
			art: 'bild',
			bild: {
				src: leipzig,
				alt: 'Schwarz-Weiß-Foto bei Nacht: Eine riesige Menschenmenge auf einem großen Platz, darüber Transparente, im Hintergrund ein Hochhaus.',
				unterschrift: 'Montagsdemonstration in Leipzig am 27. November 1989 mit rund 200.000 Menschen',
				nachweis: 'Bundesarchiv, Bild 183-1989-1127-033, Foto: Friedrich Gahlbeck',
				lizenz: lizenz.ccBySa30De,
				quelle: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-1989-1127-033,_Leipzig,_Montagsdemonstration.jpg',
			},
		},
		{
			art: 'absatz',
			text: 'Am 9. November 1989 fällt die Mauer. Ein Jahr später ist Deutschland wiedervereinigt: In der Nacht zum 3. Oktober 1990 wird um Mitternacht vor dem Reichstag in Berlin eine große Bundesflagge gehisst, die „Flagge der Einheit“. Seitdem ist der 3. Oktober unser Nationalfeiertag.',
		},
		{ art: 'titel', text: 'Fröhlich Flagge zeigen' },
		{
			art: 'absatz',
			text: 'Lange taten sich viele Deutsche schwer damit, ihre Flagge zu zeigen. Das änderte sich bei der Fußball-Weltmeisterschaft 2006 im eigenen Land, dem „Sommermärchen“: Millionen Menschen schwenkten Schwarz-Rot-Gold, fröhlich, unverkrampft und gemeinsam mit Fans aus aller Welt.',
		},
		{
			art: 'absatz',
			text: 'Daran knüpfen wir an: Schwarz-Rot-Gold verbindet. Die Farben stehen für Freiheit, Einheit und Demokratie, für alle, die hier leben.',
		},
	],
	'2026': [
		{ art: 'titel', text: 'Warum die Fahne zurückgeholt werden muss' },
		{
			art: 'absatz',
			text: 'Wer heute Schwarz-Rot-Gold zeigt, wird oft schief angesehen. Denn auf Kundgebungen gegen Demokratie und Zuwanderung wehen neben der Bundesflagge auch Fahnen, die sich gegen die Republik richten: Schwarz-Weiß-Rot, die Farben des Kaiserreichs, oder die Kreuzfahne des Widerstandskämpfers Josef Wirmer, der für ein freies Deutschland gestorben ist. So entsteht der Eindruck, die Farben unserer Demokratie gehörten denen, die sie ablehnen.',
		},
		{
			art: 'absatz',
			text: 'Dabei ist es genau umgekehrt. Wie diese Geschichte zeigt, waren Schwarz-Rot-Gold immer die Farben derer, die für Freiheit, Einheit und Mitbestimmung eingetreten sind. Ihre Gegner haben sie bekämpft, verhöhnt und verbrannt.',
		},
		{ art: 'titel', text: 'Was Klopp gesagt hat' },
		{
			art: 'zitat',
			text: 'Ich würde mir oder uns gerne die Fahne zurückholen. Ich möchte, dass, wenn man sie schwingt, niemand denkt: Was ist mit dir nicht in Ordnung?',
			herkunft: 'Jürgen Klopp bei seiner ersten Kaderbekanntgabe als Bundestrainer, 17. September 2026',
		},
		{
			art: 'absatz',
			text: 'Dazu sagt er: „Positiver Patriotismus? Gerne!“ Gemeint ist ein Stolz, der niemanden ausschließt, auf ein Land, in dem Menschen unterschiedlicher Herkunft, Religion und Überzeugung frei zusammenleben. Seine Kappe sagt es in vier Worten: „Einer von 83 Millionen“.',
		},
		{ art: 'titel', text: 'Vorsicht vor Fälschungen' },
		{
			art: 'absatz',
			text: 'Kurz nach der Pressekonferenz verbreitete sich in den sozialen Medien ein Video, nach dem Politiker Klopps Rücktritt gefordert hätten. Die Rechercheplattform Correctiv hat es geprüft: Diese Forderungen sind erfunden. Auch das gehört zum Streit um die Fahne. Wer Klopps Worte weitergibt, nimmt am besten die Originalaufnahme.',
		},
		{ art: 'titel', text: 'Und jetzt Sie' },
		{
			art: 'absatz',
			text: 'Die Fahne zurückholen heißt, sie zu zeigen: fröhlich, selbstverständlich und als Zeichen für unsere Demokratie. Genau dafür gibt es d-wie-demokratie.de. Mit unseren Motiven zeigen Sie auf Ihrem Auto, Ihrem Laptop oder Ihrem T-Shirt, wofür Schwarz-Rot-Gold steht: für Menschenwürde, Freiheit, Gleichheit und Vielfalt, für alle 83 Millionen.',
		},
	],
};

// alle Bilder und Flaggen der Vertiefungen, für die Bildnachweise
export const vertiefungsBilder: Bild[] = Object.values(vertiefung)
	.flat()
	.flatMap((b): Bild[] => {
		if (b.art === 'bild') return [b.bild];
		if (b.art === 'flaggen')
			return b.flaggen.map((f) => ({
				src: f.src,
				alt: f.alt,
				unterschrift: `Flagge: ${f.name} (${f.zeit})`,
				nachweis: 'Grafik',
				lizenz: lizenz.gemeinfrei,
				quelle: f.quelle,
			}));
		return [];
	})
	// die Bundesflagge kommt zweimal vor (Weimar und Bundesrepublik), im Nachweis nur einmal
	.filter((b, i, alle) => alle.findIndex((x) => x.quelle === b.quelle) === i);
