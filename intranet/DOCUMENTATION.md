# CC Intranet - Technische Dokumentation

## Projektübersicht

Das **CC Intranet** ist eine webbasierte Plattform zur Verwaltung von Schulungsabläufen, Zeitmanagement und interner Kommunikation für Bildungseinrichtungen. Sie basiert auf modernen Webtechnologien und bietet rollenspezifische Funktionen für Administratoren, Dozenten, Schüler und Verwaltungsmitarbeiter.

## Technologie-Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Sprache:** TypeScript
*   **Datenbank:** SQLite (via [Prisma ORM](https://www.prisma.io/))
*   **Styling:** Tailwind CSS
*   **UI Komponenten:** Radix UI / Shadcn-like Komponenten
*   **Testing:** Jest & React Testing Library

---

## Features & Funktionalitäten

### 1. Benutzerverwaltung & Rollen
Das System unterscheidet zwischen vier Hauptrollen:
*   **Admin:** Vollzugriff auf alle Bereiche (Benutzer, Kurse, Einstellungen).
*   **Verwaltung (Staff):** Zugriff auf planerische und administrative Aufgaben.
*   **Dozent (Teacher):** Verwaltung eigener Kurse, Noteneingabe, Skill-Profile.
*   **Schüler (Student):** Einsicht in Stundenpläne, Noten, Zeiterfassung.

### 2. Zeiterfassung (Time Tracking)
*   **Clock In/Out:** Benutzer können ihre Arbeits-/Lernzeiten erfassen.
*   **Standort:** Unterscheidung zwischen "ON_SITE" (Campus) und "REMOTE" (Home Office).
*   **Statistik:** Übersicht über geleistete Stunden.

### 3. Kurs- & Bildungsplanung
*   **Education Tracks:** Verwaltung von Umschulungsjahrgängen (z.B. "Fachinformatiker Winter 2025").
*   **Kurse:** Erstellung von Kursmodulen innerhalb eines Tracks.
*   **Themengebiete:** Detaillierte Planung von Unterrichtseinheiten pro Kurs.
*   **Raumplanung:** Zuweisung von physischen oder virtuellen Räumen.

### 4. Prüfungswesen & Noten
*   **Klausuren:** Anlegen von Prüfungsterminen und Inhalten.
*   **Noten:** Erfassung und Einsicht von Bewertungsergebnissen pro Schüler und Fach.

### 5. Kommunikation & Bulletin Board
*   **Anfragen (Inquiries):** Ticket-ähnliches System für direkte Fragen an Dozenten oder Verwaltung.
*   **Schwarzes Brett:** "Suche/Biete"-Marktplatz für die interne Community.
*   **Ankündigungen:** Globale Nachrichten der Verwaltung.

---

## Datenbank-Schema (Prisma)

Das Datenmodell ist relational aufgebaut. Hier sind die wichtigsten Modelle:

### Kern-Modelle
*   `User`: Zentraler Benutzer-Datensatz. Enthält Rolle, Abteilung und Relationen zu allen anderen Modulen.
*   `EducationTrack`: Repräsentiert einen Jahrgang oder eine Umschulungsklasse.
*   `Course`: Ein spezifisches Modul (z.B. "Netzwerktechnik") innerhalb eines Tracks.

### Zeit & Planung
*   `TimeEntry`: Speichert Kommen/Gehen-Zeiten.
*   `CourseEvent`: Einzelne Termine oder Unterrichtsblöcke (Kalender-Events).
*   `Room`: Ressourcenverwaltung für Räume.

### Kommunikation & Akademisches
*   `Inquiry`: Nachrichten-Objekt für den internen Support.
*   `BulletinPost`: Einträge für das schwarze Brett.
*   `Exam` & `Grade`: Prüfungsdefinitionen und zugehörige Noten.
*   `TeacherSkill` & `Tag`: Verwaltung von Dozenten-Qualifikationen.

**Umgang mit der Datenbank:**
Änderungen am Schema müssen in `prisma/schema.prisma` vorgenommen werden. Danach sind folgende Befehle notwendig:
1.  `npx prisma generate` (Aktualisiert den Client)
2.  `npx prisma db push` (Synchronisiert die SQLite-Datenbank)

---

## Testing

Das Projekt verwendet **Jest** für Unit- und Integrationstests.

### Tests ausführen
```bash
npm test
```

### Test-Struktur
Tests befinden sich idealerweise neben den Komponenten (z.B. `components/__tests__/`) oder in einem separaten `tests/` Ordner.
*   **Unit Tests:** Testen einzelner Funktionen oder isolierter UI-Komponenten.
*   **Integration Tests:** Testen des Zusammenspiels mehrerer Komponenten (z.B. Formular-Submit und Datenbank-Mock).

---

## Logik & Architektur

Das Projekt folgt der Next.js **App Router** Architektur:
*   `app/`: Enthält die Routen (Pages), Layouts und API-Endpunkte.
*   `components/`: Wiederverwendbare UI-Bausteine.
*   `lib/`: Hilfsfunktionen (z.B. Datenbank-Client Instanz `db.ts`).
*   `hooks/`: Custom React Hooks für Logik-Kapselung.

Die Geschäftslogik ist teilweise in den API-Routen (`app/api/`) und teilweise direkt in den Server Components implementiert (Data Fetching). Client Components (`"use client"`) werden für interaktive Elemente (Formulare, Dialoge) verwendet.
