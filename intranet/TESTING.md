# Tests für CC Intranet

Diese Dokumentation beschreibt, wie Tests im Projekt ausgeführt und erweitert werden.

## Übersicht

Wir verwenden **Jest** und **React Testing Library** für automatisierte Tests.

### Test-Befehl
Führen Sie alle Tests mit folgendem Befehl aus:
```bash
npm test
```

## Vorhandene Tests

### 1. Utility Tests (`lib/__tests__/`)
Hier werden reine Logik-Funktionen getestet, die keine UI-Komponenten benötigen.

*   **`time-utils.test.ts`**: Testet Zeitberechnungs- und Formatierungsfunktionen.
    *   `formatDuration`: Prüft, ob Minuten korrekt in `HH:MM` umgewandelt werden.

## Test-Strategie erweitern

### Wie füge ich einen neuen Test hinzu?

1.  **Erstelle eine Testdatei:**
    Erstelle eine Datei mit der Endung `.test.ts` oder `.test.tsx` im gleichen Ordner wie die Komponente oder in einem `__tests__` Unterordner.
    *   Beispiel: `components/MyButton.tsx` -> `components/__tests__/MyButton.test.tsx`

2.  **Schreibe den Test:**
    ```typescript
    import { render, screen } from '@testing-library/react'
    import MyButton from '../MyButton'

    describe('MyButton', () => {
      it('renders correctly', () => {
        render(<MyButton label="Click me" />)
        const button = screen.getByText('Click me')
        expect(button).toBeInTheDocument()
      })
    })
    ```

3.  **Führe den Test aus:**
    `npm test`

### Wichtige Bereiche für zukünftige Tests

*   **API Routen:** Integrationstests für `app/api/` Endpunkte (Mocking der Datenbank erforderlich).
*   **Komplexe Komponenten:**
    *   `TimeTrackingWidget`: Testen der Start/Stop Logik.
    *   `GradeInput`: Validierung der Eingaben.
*   **Prisma/Datenbank:**
    *   Unit Tests für Datenbank-Logik sollten eine separate In-Memory Datenbank oder Mocks verwenden, um die Produktionsdaten nicht zu gefährden.
