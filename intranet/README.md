# CC Vibe Portal 🚀

Ein modernes Firmen-Intranet, erstellt mit Vibe Coding.

## Features

*   **Dashboard**: Übersicht über News, Zeiterfassung und Kurse.
*   **Zeiterfassung**: Einfaches Ein- und Ausstempeln mit Historie.
*   **Kursplan**: Automatische Gruppierung von Kursen nach Datum.
*   **Schwarzes Brett**: "Suche & Biete" Marktplatz für Studenten.

## Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Database**: SQLite (via Prisma ORM)
*   **Styling**: Tailwind CSS v4 + shadcn/ui

## Installation & Start

1.  Abhängigkeiten installieren:
    ```bash
    npm install
    ```

2.  Datenbank vorbereiten:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

3.  Server starten:
    ```bash
    npm run dev
    ```

Das Portal ist dann unter `http://localhost:3000` erreichbar.

## Projektstruktur

*   `/app`: Next.js Pages & Layouts
*   `/components`: UI Komponenten (Buttons, Cards, Sidebar)
*   `/lib`: Server Actions & Datenbank-Client
*   `/prisma`: Datenbankschema & Seed-Script
