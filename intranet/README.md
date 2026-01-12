# CC Vibe Portal 🚀

Ein modernes Firmen-Intranet / LMS-Prototyp, erstellt mit Vibe Coding.

## Features

*   **Rollensystem**: Login als Student, Lehrer oder Administrator (via Dev-Login).
*   **Dashboard**: Rollenspezifische Widgets (News, Kurse, offene Anfragen).
*   **Zeiterfassung**: Einfaches Ein- und Ausstempeln mit Historie & Arbeitszeit-Statistik.
*   **Kursplan**: Übersicht über anstehende Module und Prüfungen.
*   **Schwarzes Brett**: "Suche & Biete" Marktplatz.
*   **Support-System (Anfragen)**:
    *   Schüler können Fragen an Lehrer oder Admins stellen.
    *   Personal kann Anfragen beantworten.
    *   Historie der gestellten und beantworteten Fragen.
*   **Profil-Seiten**:
    *   **Studenten**: Notenübersicht und Anwesenheits-KPIs.
    *   **Lehrer**: Übersicht der Lehrkompetenzen (aktive/inaktive Module).
    *   **Admins**: Abteilungsinfo und Arbeitszeit-Auswertung.

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

2.  Datenbank synchronisieren (Push):
    ```bash
    npx prisma db push
    ```

3.  (Optional) Datenbank mit Testdaten füllen:
    ```bash
    npx prisma db seed
    ```

4.  Server starten:
    ```bash
    npm run dev
    ```

Das Portal ist dann unter `http://localhost:3000` erreichbar.

## Projektstruktur

*   `/app`: Next.js Pages & Layouts (Dashboard, Profil, Inquiries, etc.)
*   `/components`: UI Komponenten (Sidebar, Widgets, shadcn/ui)
*   `/lib`: Server Actions (Business Logic) & Auth
*   `/prisma`: Datenbankschema (Models für User, Grade, Inquiry, etc.)
