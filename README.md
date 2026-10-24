# Studieplanlegger

En enkel og ren studieplanlegger for studenter, laget med **React** og **Vite**. Appen hjelper deg å holde oversikt over fagene dine og fristene i dem, og gjør det tydelig hva som haster.

**Live-versjon:** https://johskr.github.io/Mandatory-Assignment-3/

## Funksjoner

- **Fag med farge** – legg til fag med navn og en farge (åtte ferdige farger eller en egendefinert). Fargen brukes som markering på alle oppgaver i faget, så du kjenner dem igjen raskt.
- **Oppgaver og frister** – registrer oppgaver knyttet til et fag, med frist (dato) og eventuelt et klokkeslett. Kryss av når oppgaven er ferdig; du kan også angre eller slette den.
- **Valgfritt klokkeslett** – har du flere frister samme dag, kan du legge til klokkeslett (f.eks. 15:00 og 23:59). Oppgaver samme dag sorteres da etter klokkeslett, og de uten klokkeslett havner sist, siden fristen gjelder ut dagen. En frist i dag der klokkeslettet har passert, regnes som forfalt.
- **Oversikt over kommende frister** – alle uferdige oppgaver vises sortert etter dato, nærmeste først.
  - Frister **innen 3 dager** (i dag til og med om tre dager) er uthevet i gult.
  - **Forfalte** frister er markert i rødt.
  - Ferdige oppgaver ligger i en egen liste som kan vises eller skjules.
- **Filtrering** – klikk på et fag i fagslisten for å bare se oppgavene i det faget. Klikk igjen (eller på merkelappen i oversikten) for å vise alle.
- **Sammendrag** – øverst ser du antall åpne oppgaver, hvor mange som har frist innen 3 dager, og hvor mange som har forfalt.
- **Lagring i nettleseren** – alt lagres i `localStorage`. Det finnes ingen backend og ingen innlogging; dataene ligger bare i nettleseren du bruker.
- **Eksempeldata** – knappen «Last inn eksempeldata» fyller appen med tre eksempelfag (DAVE3625 i rødt, ITPE3200 i blått og ITPE3100 i grønt) og åtte oppgaver. Datoene regnes ut fra dagens dato når du trykker, så du alltid får minst én forfalt frist, flere frister innen 3 dager (noen med klokkeslett), noen lenger frem i tid og én ferdig oppgave. Når appen er tom, vises knappen tydelig midt i oversikten. Ellers ligger den diskret nederst på siden. Har du allerede data, blir du bedt om å bekrefte før alt erstattes.
- **Mørkt og lyst tema** – appen starter i mørkt tema. Med knappen øverst kan du raskt veksle til lyst tema og tilbake; valget huskes til neste gang.
- **Mobilvennlig** – layouten går fra to kolonner på store skjermer til én kolonne på mobil, med store trykkflater.

## Validering

- Et fag kan ikke ha tomt navn (bare mellomrom regnes som tomt), og du kan ikke lage to fag med samme navn.
- Fagnavn kan være maks 40 tegn og oppgavenavn maks 80 tegn. En teller ved feltet viser hvor mange tegn du har brukt. Lang tekst brytes over flere linjer i stedet for å gjøre boksene bredere.
- En oppgave må ha et navn og en frist (dato). Prøver du å lagre uten, vises en feilmelding ved feltet. Klokkeslett er valgfritt.
- Du må ha minst ett fag før du kan legge til oppgaver.
- Sletter du et fag, blir du bedt om å bekrefte, og oppgavene i faget slettes også.

## Kom i gang lokalt

Krever [Node.js](https://nodejs.org/) 20 eller nyere.

```bash
npm install      # installer avhengigheter
npm run dev      # start utviklingsserver på http://localhost:5173/Mandatory-Assignment-3/
npm run build    # bygg produksjonsversjon til dist/
npm run preview  # forhåndsvis produksjonsbygget lokalt
```

## Prosjektstruktur

```
src/
├── App.jsx                  # Tilstand (fag, oppgaver, filter) og layout
├── main.jsx                 # Inngangspunkt
├── index.css                # All styling (mørkt/lyst tema, responsiv)
├── hooks/
│   └── useLocalStorage.js   # useState som lagres i localStorage
├── utils/
│   ├── dates.js             # Datohjelpere (dager igjen, «innen 3 dager», formatering)
│   ├── id.js                # Generering av unike ID-er
│   └── sampleData.js        # Eksempelfag og -oppgaver med datoer relativt til i dag
└── components/
    ├── SubjectForm.jsx      # Skjema for nytt fag
    ├── SubjectList.jsx      # Liste over fag, med filter og sletting
    ├── TaskForm.jsx         # Skjema for ny oppgave
    ├── Overview.jsx         # Kommende og ferdige frister
    ├── TaskItem.jsx         # Én oppgave i listen
    ├── ThemeToggle.jsx      # Knapp for å veksle mellom mørkt og lyst tema
    └── icons.jsx            # SVG-ikoner
```

### Datamodell

Data lagres under to nøkler i `localStorage` (i tillegg lagres valgt tema under `studieplanlegger.theme`):

```js
// studieplanlegger.subjects
[{ id: "…", name: "Kunstig intelligens", color: "#4f46e5" }]

// studieplanlegger.tasks
[{ id: "…", title: "Innlevering 3", subjectId: "…", dueDate: "2026-10-27", dueTime: "15:00", done: false, createdAt: 1761330000000 }]
```

`dueTime` er `null` når oppgaven ikke har klokkeslett. Datoer lagres som `YYYY-MM-DD` og klokkeslett som `HH:MM`, og begge tolkes alltid som lokal tid, slik at «i dag» og «i morgen» blir riktig uansett tidssone.

## Deploy

Appen deployes automatisk til GitHub Pages med GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) hver gang det pushes til `main`. Workflowen bygger appen med `npm run build` og publiserer `dist/`-mappen.

Engangsoppsett i repoet: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

`base` i [vite.config.js](vite.config.js) er satt til `/Mandatory-Assignment-3/` slik at stiene stemmer med adressen på GitHub Pages.

## Hvordan appen ble laget med AI

Jeg bygde appen med **Claude Code**, Anthropics AI-assistent for programmering, som en utvidelse i **VS Code**. Jeg beskrev hva jeg ville ha med vanlig tekst. Claude Code skrev koden, bygde prosjektet og tok seg av git og deploy.

**Første prompt.** Jeg ba om en React-app laget med Vite: en studieplanlegger for studenter med disse funksjonene:

1. legge til fag med navn og farge
2. legge til oppgaver og frister knyttet til et fag, med dato, og kunne markere dem som ferdige
3. en oversikt som viser kommende frister sortert etter dato, og fremhever de som er innen 3 dager

Alt skulle lagres i `localStorage`, uten backend. Appen skulle ikke godta tomme navn eller frister uten dato. Designet skulle være rent og moderne og fungere på mobil. I tillegg ba jeg om en README, om å opprette et git-repo koblet til GitHub og pushe, og om automatisk deploy til GitHub Pages.

**Senere endringer.** Da den første versjonen var ferdig, ba jeg om flere nye funksjoner:

- **Lyst tema:** en knapp for å bytte raskt mellom mørkt og lyst tema. Mørkt tema er fortsatt standard.
- **Valgfritt klokkeslett:** mulighet til å legge til klokkeslett på frister. Da kan to oppgaver med frist samme dag skilles fra hverandre (for eksempel 15:00 og 23:59) uten at klokkeslett blir påkrevd.
- **Eksempeldata:** en knapp som fyller appen med eksempelfag og -oppgaver, med datoer regnet ut fra dagens dato. Da er det raskt å vise frem og teste alle tilstandene: forfalt, innen 3 dager, lenger frem og ferdig.

### Testing og forbedringer

Etter hver endring testet jeg appen manuelt i nettleseren:

- **Fag med tomt navn:** Jeg prøvde å legge til et fag uten navn, og et fag med bare mellomrom som navn. Begge ble avvist med feilmeldingen «Fagnavn kan ikke være tomt.».
- **Påkrevde felter i oppgaver:** Jeg prøvde å lagre en oppgave uten navn og uten dato. Oppgaven ble ikke lagret, og det kom en feilmelding ved hvert felt som manglet. Uten noen fag vises ikke oppgaveskjemaet. Da står det en beskjed om at man må legge til et fag først.
- **Lagring etter refresh:** Jeg la til fag og oppgaver, krysset av noen som ferdige, byttet tema og lastet siden på nytt. Alt var der fortsatt, også valgt tema.
- **Klokkeslett er valgfritt:** Jeg la til oppgaver både med og uten klokkeslett. Begge deler fungerte, og oppgaver samme dag ble sortert etter klokkeslett, med de uten klokkeslett sist.
- **Forfalt klokkeslett i dag:** Jeg la til en oppgave med frist i dag og et klokkeslett som allerede var passert. Den ble markert som forfalt (rød). En oppgave i dag med et senere klokkeslett ble markert som «I dag» og uthevet.
- **Frister innen 3 dager:** Oppgaver med frist i dag og de tre neste dagene ble uthevet. Oppgaver lenger fram ble ikke det.
- **Mobil og tema:** Jeg sjekket at layouten fungerer på mobilskjerm, og at temaknappen bytter mellom mørkt og lyst med en gang.

Alt dette fungerte som det skulle.

**Feil jeg fant under testing: lange fagnavn ødela layouten.** Da jeg la til et fag med et veldig langt navn, ble venstrekolonnen så bred at den la seg over «Kommende frister», og fristene ble umulige å se. Årsaken var nedtrekkslisten «Fag» i oppgaveskjemaet. Den blir like bred som det lengste fagnavnet, og kolonnen strakk seg etter den. Jeg ba Claude Code rette feilen, og løsningen ble:

- Kolonnene og boksene har fått fast bredde og vokser ikke lenger med innholdet. Lange fagnavn kortes av med «…» i nedtrekkslisten.
- Lange fag- og oppgavenavn brytes over flere linjer i fagslisten og i oversikten, i stedet for å presse boksen bredere.
- Fagnavn er begrenset til 40 tegn og oppgavenavn til 80 tegn, med en teller som viser antall tegn brukt.

Etter rettingen testet jeg på nytt med lange navn, både med og uten mellomrom. Layouten holdt seg som den skulle på både PC og mobil.
