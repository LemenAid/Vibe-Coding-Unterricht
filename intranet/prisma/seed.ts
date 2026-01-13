
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function parseDate(dateStr: string, timeStr: string = "00:00:00"): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// Data from Kursinhalte.md (converted to JSON-like structure in previous step)
const rawTopics = [
  {
    "title": "Fachbezogenes Rechnen",
    "courseName": "Einführung fachbezogenes Rechnen / Digitaltechnik",
    "startDate": "03.02.2025",
    "endDate": "07.02.2025",
    "ue": 45,
    "tags": ["Mathematik", "Grundlagen"]
  },
  {
    "title": "Digitaltechnik",
    "courseName": "Einführung fachbezogenes Rechnen / Digitaltechnik",
    "startDate": "10.02.2025",
    "endDate": "12.02.2025",
    "ue": 27,
    "tags": ["Digitaltechnik", "Grundlagen"]
  },
  {
    "title": "Einführung Programmierung",
    "courseName": "Einführung Programmierung",
    "startDate": "13.02.2025",
    "endDate": "21.02.2025",
    "ue": 63,
    "tags": ["Programmierung", "Grundlagen"]
  },
  {
    "title": "Einführung Datenbanken",
    "courseName": "Einführung Datenbanken",
    "startDate": "24.02.2025",
    "endDate": "04.03.2025",
    "ue": 63,
    "tags": ["Datenbanken", "SQL"]
  },
  {
    "title": "Verkabelung",
    "courseName": "Einführung Netzwerktechnik",
    "startDate": "05.03.2025",
    "endDate": "06.03.2025",
    "ue": 18,
    "tags": ["Netzwerk", "Hardware"]
  },
  {
    "title": "Netzwerkgrundlagen",
    "courseName": "Einführung Netzwerktechnik",
    "startDate": "07.03.2025",
    "endDate": "11.03.2025",
    "ue": 27,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Ethernet",
    "courseName": "Einführung Netzwerktechnik",
    "startDate": "12.03.2025",
    "endDate": "12.03.2025",
    "ue": 9,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Kommunikationsprotokolle",
    "courseName": "Einführung Netzwerktechnik",
    "startDate": "13.03.2025",
    "endDate": "14.03.2025",
    "ue": 18,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Arbeitsorganisation und -techniken",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "17.03.2025",
    "endDate": "18.03.2025",
    "ue": 14,
    "tags": ["BWL", "Soft Skills"]
  },
  {
    "title": "Sicherheit, Gesundheits- und Umweltschutz",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "18.03.2025",
    "endDate": "19.03.2025",
    "ue": 13,
    "tags": ["BWL", "Recht"]
  },
  {
    "title": "Prozessorganisation und -ablauf",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "20.03.2025",
    "endDate": "21.03.2025",
    "ue": 18,
    "tags": ["BWL"]
  },
  {
    "title": "Informieren und Beraten von Kunden/Kundinnen",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "24.03.2025",
    "endDate": "26.03.2025",
    "ue": 27,
    "tags": ["BWL", "Kommunikation"]
  },
  {
    "title": "Kommunikation und vernetztes Zusammenarbeiten unter Nutzung digitaler Medien",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "27.03.2025",
    "endDate": "31.03.2025",
    "ue": 27,
    "tags": ["BWL", "Kommunikation"]
  },
  {
    "title": "Klausur",
    "courseName": "Allgemeine Betriebswirtschaftslehre",
    "startDate": "01.04.2025",
    "endDate": "01.04.2025",
    "ue": 9,
    "tags": ["BWL"]
  },
  {
    "title": "Grundlagen Qualitätsmanagement und Qualitätssicherung",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I",
    "startDate": "02.04.2025",
    "endDate": "04.04.2025",
    "ue": 27,
    "tags": ["QM", "Datenschutz"]
  },
  {
    "title": "Maßnahmen und Anforderungen zur IT-Sicherheit und Datenschutz",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I",
    "startDate": "07.04.2025",
    "endDate": "11.04.2025",
    "ue": 45,
    "tags": ["IT-Sicherheit", "Datenschutz"]
  },
  {
    "title": "Klausur",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I",
    "startDate": "14.04.2025",
    "endDate": "14.04.2025",
    "ue": 9,
    "tags": ["IT-Sicherheit"]
  },
  {
    "title": "Refresh Digitaltechnik",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "15.04.2025",
    "endDate": "17.04.2025",
    "ue": 30,
    "tags": ["Netzwerk", "Digitaltechnik"]
  },
  {
    "title": "Kommunikationsgrundlagen",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "28.04.2025",
    "endDate": "29.04.2025",
    "ue": 15,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Transportorientierte Schichten",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "29.04.2025",
    "endDate": "30.04.2025",
    "ue": 15,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Transportorientierte Schichten",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "02.05.2025",
    "endDate": "05.05.2025",
    "ue": 15,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Internetkommunikation",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "05.05.2025",
    "endDate": "07.05.2025",
    "ue": 25,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Anwendungsorientierte Schichten",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "08.05.2025",
    "endDate": "12.05.2025",
    "ue": 30,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Hardware und Sicherheit",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "13.05.2025",
    "endDate": "14.05.2025",
    "ue": 15,
    "tags": ["Netzwerk", "IT-Sicherheit"]
  },
  {
    "title": "Öffentliche Kommunikationsnetze",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "14.05.2025",
    "endDate": "14.05.2025",
    "ue": 5,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Vermittlungstechnik",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "15.05.2025",
    "endDate": "15.05.2025",
    "ue": 10,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Mobilfunk",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "16.05.2025",
    "endDate": "16.05.2025",
    "ue": 5,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Satellitennetze, GPS",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "16.05.2025",
    "endDate": "16.05.2025",
    "ue": 5,
    "tags": ["Netzwerk"]
  },
  {
    "title": "Klausur",
    "courseName": "Netzwerk- und Kommunikationstechnik",
    "startDate": "19.05.2025",
    "endDate": "19.05.2025",
    "ue": 10,
    "tags": ["Netzwerk"]
  },
  {
    "title": "marktgängige IT-Systeme für unterschiedliche Einsatzbereich hinsichtlich Leistungsfähigkeit, Wirtschaftlichkeit und Barrierefreiheit beurteilen",
    "courseName": "Systemtechnik Teil I",
    "startDate": "20.05.2025",
    "endDate": "23.05.2025",
    "ue": 32,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Angebote zu IT-Komponenten, IT-Produkten und IT-Dienstleistungen einholen und bewerten sowie Spezifikationen und Konditionen vergleichen",
    "courseName": "Systemtechnik Teil I",
    "startDate": "23.05.2025",
    "endDate": "27.05.2025",
    "ue": 18,
    "tags": ["Systemintegration", "BWL"]
  },
  {
    "title": "IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "courseName": "Systemtechnik Teil I",
    "startDate": "27.05.2025",
    "endDate": "28.05.2025",
    "ue": 13,
    "tags": ["Systemintegration", "Recht"]
  },
  {
    "title": "IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "courseName": "Systemtechnik Teil I",
    "startDate": "30.05.2025",
    "endDate": "30.05.2025",
    "ue": 9,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Klausur",
    "courseName": "Systemtechnik Teil I",
    "startDate": "02.06.2025",
    "endDate": "02.06.2025",
    "ue": 9,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Leistungen nach betrieblichen und vertraglichen Vorgaben dokumentieren",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "03.06.2025",
    "endDate": "04.06.2025",
    "ue": 18,
    "tags": ["BWL", "Projektmanagement"]
  },
  {
    "title": "Leistungserbringung unter Berücksichtigung organisatorischer/terminlicher Vorgaben mit Kunden und Kundinnen abstimmen und kontrollieren",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "05.06.2025",
    "endDate": "06.06.2025",
    "ue": 14,
    "tags": ["BWL", "Kommunikation"]
  },
  {
    "title": "Veränderungsprozesse begleiten und unterstützen",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "06.06.2025",
    "endDate": "06.06.2025",
    "ue": 4,
    "tags": ["BWL"]
  },
  {
    "title": "Veränderungsprozesse begleiten und unterstützen",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "10.06.2025",
    "endDate": "10.06.2025",
    "ue": 5,
    "tags": ["BWL"]
  },
  {
    "title": "Einweisung von Kunden/Kundinnen in die Nutzung von Produkten und Dienstleistungen, Leistungen/Dokumentationen übergeben, Abnahmeprotokolle anfertigen",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "10.06.2025",
    "endDate": "12.06.2025",
    "ue": 18,
    "tags": ["BWL", "Kommunikation"]
  },
  {
    "title": "Kosten für erbrachte Leistungen erfassen sowie im Zeitvergleich und im Soll-Ist-Vergleich bewerten",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "12.06.2025",
    "endDate": "17.06.2025",
    "ue": 27,
    "tags": ["BWL", "Rechnungswesen"]
  },
  {
    "title": "Kommunikation und Kundenbeziehungen",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "17.06.2025",
    "endDate": "18.06.2025",
    "ue": 13,
    "tags": ["BWL", "Kommunikation"]
  },
  {
    "title": "Klausur",
    "courseName": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement",
    "startDate": "20.06.2025",
    "endDate": "20.06.2025",
    "ue": 9,
    "tags": ["BWL"]
  },
  {
    "title": "SAP Überblick",
    "courseName": "Branchenspezifische ERP-Software",
    "startDate": "23.06.2025",
    "endDate": "30.06.2025",
    "ue": 54,
    "tags": ["SAP", "ERP"]
  },
  {
    "title": "Zertifizierungsvorbereitung",
    "courseName": "Branchenspezifische ERP-Software",
    "startDate": "01.07.2025",
    "endDate": "02.07.2025",
    "ue": 18,
    "tags": ["SAP"]
  },
  {
    "title": "SAP-Zertifizierung (optional)",
    "courseName": "Branchenspezifische ERP-Software",
    "startDate": "03.07.2025",
    "endDate": "03.07.2025",
    "ue": 9,
    "tags": ["SAP"]
  },
  {
    "title": "Technisches Englisch",
    "courseName": "Technisches Englisch",
    "startDate": "04.07.2025",
    "endDate": "15.07.2025",
    "ue": 72,
    "tags": ["Englisch", "Sprachen"]
  },
  {
    "title": "Klausur",
    "courseName": "Technisches Englisch",
    "startDate": "16.07.2025",
    "endDate": "16.07.2025",
    "ue": 9,
    "tags": ["Englisch"]
  },
  {
    "title": "Grundlagen",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "17.07.2025",
    "endDate": "18.07.2025",
    "ue": 18,
    "tags": ["Programmierung"]
  },
  {
    "title": "Refresh Programmierungsgrundlagen",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "21.07.2025",
    "endDate": "21.07.2025",
    "ue": 9,
    "tags": ["Programmierung"]
  },
  {
    "title": "Programmiertechniken/-methoden",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "22.07.2025",
    "endDate": "28.07.2025",
    "ue": 45,
    "tags": ["Programmierung"]
  },
  {
    "title": "Abgrenzung prozedurale zu objektorientierter Programmierung",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "29.07.2025",
    "endDate": "29.07.2025",
    "ue": 9,
    "tags": ["Programmierung"]
  },
  {
    "title": "Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "30.07.2025",
    "endDate": "01.08.2025",
    "ue": 27,
    "tags": ["Programmierung", "OOP"]
  },
  {
    "title": "Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "18.08.2025",
    "endDate": "18.08.2025",
    "ue": 5,
    "tags": ["Programmierung", "OOP"]
  },
  {
    "title": "Analyse und Design",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "18.08.2025",
    "endDate": "20.08.2025",
    "ue": 18,
    "tags": ["Programmierung", "Design"]
  },
  {
    "title": "UML",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "20.08.2025",
    "endDate": "25.08.2025",
    "ue": 27,
    "tags": ["Programmierung", "UML"]
  },
  {
    "title": "Lösungen konkreter Problemstellungen - prozedural und objektorientiert implementieren",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "25.08.2025",
    "endDate": "29.08.2025",
    "ue": 40,
    "tags": ["Programmierung"]
  },
  {
    "title": "Testverfahren/-konzepte",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "01.09.2025",
    "endDate": "01.09.2025",
    "ue": 9,
    "tags": ["Programmierung", "Testing"]
  },
  {
    "title": "Klausur",
    "courseName": "Prozedurale und Objektorientierte Programmierung",
    "startDate": "02.09.2025",
    "endDate": "02.09.2025",
    "ue": 9,
    "tags": ["Programmierung"]
  },
  {
    "title": "Refresh Datenbankmodelle",
    "courseName": "Datenbanken",
    "startDate": "03.09.2025",
    "endDate": "03.09.2025",
    "ue": 9,
    "tags": ["Datenbanken"]
  },
  {
    "title": "Datenbankdesign",
    "courseName": "Datenbanken",
    "startDate": "04.09.2025",
    "endDate": "09.09.2025",
    "ue": 32,
    "tags": ["Datenbanken"]
  },
  {
    "title": "SQL",
    "courseName": "Datenbanken",
    "startDate": "09.09.2025",
    "endDate": "17.09.2025",
    "ue": 58,
    "tags": ["Datenbanken", "SQL"]
  },
  {
    "title": "Klausur",
    "courseName": "Datenbanken",
    "startDate": "18.09.2025",
    "endDate": "18.09.2025",
    "ue": 9,
    "tags": ["Datenbanken"]
  },
  {
    "title": "technologische Entwicklungstrends von IT-Systemen feststellen sowie ihre wirtschaftlichen, sozialen und beruflichen Auswirkungen aufzeigen",
    "courseName": "Systemtechnik Teil II",
    "startDate": "19.09.2025",
    "endDate": "23.09.2025",
    "ue": 25,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Veränderungen von Einsatzfeldern für IT-Systeme aufgrund technischer, wirtschaftlicher und gesellschaftlicher Entwicklungen feststellen",
    "courseName": "Systemtechnik Teil II",
    "startDate": "23.09.2025",
    "endDate": "24.09.2025",
    "ue": 15,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Qualitätsmessung, -überwachung und -verbesserung",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II",
    "startDate": "25.09.2025",
    "endDate": "30.09.2025",
    "ue": 36,
    "tags": ["QM"]
  },
  {
    "title": "IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II",
    "startDate": "01.10.2025",
    "endDate": "02.10.2025",
    "ue": 18,
    "tags": ["IT-Sicherheit", "Datenschutz"]
  },
  {
    "title": "IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II",
    "startDate": "06.10.2025",
    "endDate": "08.10.2025",
    "ue": 27,
    "tags": ["IT-Sicherheit", "Datenschutz"]
  },
  {
    "title": "Klausur",
    "courseName": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II",
    "startDate": "09.10.2025",
    "endDate": "09.10.2025",
    "ue": 9,
    "tags": ["IT-Sicherheit"]
  },
  {
    "title": "Berufliche Bildung im dualen System; Arbeits- und Tarifrecht",
    "courseName": "Fachrichtungsübergreifendes Modul I",
    "startDate": "10.10.2025",
    "endDate": "10.10.2025",
    "ue": 10,
    "tags": ["BWL", "Recht"]
  },
  {
    "title": "Betreiben von IT-Systemen",
    "courseName": "Fachrichtungsübergreifendes Modul I",
    "startDate": "13.10.2025",
    "endDate": "15.10.2025",
    "ue": 30,
    "tags": ["Systemintegration"]
  },
  {
    "title": "Programmieren von Softwarelösungen",
    "courseName": "Fachrichtungsübergreifendes Modul I",
    "startDate": "16.10.2025",
    "endDate": "21.10.2025",
    "ue": 40,
    "tags": ["Programmierung"]
  },
  {
    "title": "Vorgehensmodelle und -methoden sowie Entwicklungsumgebungen und -bibliotheken auswählen und einsetzen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "22.10.2025",
    "endDate": "23.10.2025",
    "ue": 15,
    "tags": ["Programmierung", "Methoden"]
  },
  {
    "title": "Analyse- und Designverfahren anwenden",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "23.10.2025",
    "endDate": "30.10.2025",
    "ue": 50,
    "tags": ["Programmierung", "Design"]
  },
  {
    "title": "Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "30.10.2025",
    "endDate": "30.10.2025",
    "ue": 5,
    "tags": ["Programmierung", "UI/UX"]
  },
  {
    "title": "Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "03.11.2025",
    "endDate": "07.11.2025",
    "ue": 45,
    "tags": ["Programmierung", "UI/UX"]
  },
  {
    "title": "Sicherheitsaspekte bei der Entwicklung von Softwareanwendungen berücksichtigen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "07.11.2025",
    "endDate": "10.11.2025",
    "ue": 10,
    "tags": ["Programmierung", "IT-Sicherheit"]
  },
  {
    "title": "Datenintegrität mithilfe von Werkzeugen sicherstellen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "10.11.2025",
    "endDate": "11.11.2025",
    "ue": 10,
    "tags": ["Datenbanken", "IT-Sicherheit"]
  },
  {
    "title": "Modultests erstellen und durchführen",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "11.11.2025",
    "endDate": "12.11.2025",
    "ue": 15,
    "tags": ["Programmierung", "Testing"]
  },
  {
    "title": "Klausur",
    "courseName": "Fachspezifisches Modul I",
    "startDate": "13.11.2025",
    "endDate": "13.11.2025",
    "ue": 10,
    "tags": ["Programmierung"]
  },
  {
    "title": "Cloud-Konzepte",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "14.11.2025",
    "endDate": "17.11.2025",
    "ue": 14,
    "tags": ["Cloud", "AWS"]
  },
  {
    "title": "Sicherheit und Compliance",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "17.11.2025",
    "endDate": "18.11.2025",
    "ue": 13,
    "tags": ["Cloud", "IT-Sicherheit"]
  },
  {
    "title": "Sicherheit und Compliance",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "20.11.2025",
    "endDate": "20.11.2025",
    "ue": 5,
    "tags": ["Cloud", "IT-Sicherheit"]
  },
  {
    "title": "Cloud-Technologie und -Services",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "20.11.2025",
    "endDate": "24.11.2025",
    "ue": 22,
    "tags": ["Cloud"]
  },
  {
    "title": "Fakturierung, Preisgestaltung und Support",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "25.11.2025",
    "endDate": "25.11.2025",
    "ue": 9,
    "tags": ["Cloud", "BWL"]
  },
  {
    "title": "Prüfung AWS Certified Cloud Practitioner (CLF-C02)",
    "courseName": "Branchenspezifische Cloud-Lösungen",
    "startDate": "26.11.2025",
    "endDate": "26.11.2025",
    "ue": 9,
    "tags": ["Cloud", "Zertifizierung"]
  },
  {
    "title": "Einführung Projektmanagement",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "27.11.2025",
    "endDate": "27.11.2025",
    "ue": 9,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Definitionsphase",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "28.11.2025",
    "endDate": "01.12.2025",
    "ue": 14,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Planungsphase",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "01.12.2025",
    "endDate": "02.12.2025",
    "ue": 13,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Realisierungsphase",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "03.12.2025",
    "endDate": "04.12.2025",
    "ue": 14,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Abschlussphase",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "04.12.2025",
    "endDate": "04.12.2025",
    "ue": 4,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Projektarbeit: Anwendung/Umsetzung der fachspezifischen Projektmanagementinhalte",
    "courseName": "Projektmanagement und Projektarbeit",
    "startDate": "05.12.2025",
    "endDate": "10.12.2025",
    "ue": 36,
    "tags": ["Projektmanagement", "Praxis"]
  },
  {
    "title": "Überblick agiles Projektmanagement",
    "courseName": "Agiles Projektmanagement",
    "startDate": "11.12.2025",
    "endDate": "11.12.2025",
    "ue": 9,
    "tags": ["Projektmanagement", "Agil"]
  },
  {
    "title": "Projektmanagement mit SCRUM",
    "courseName": "Agiles Projektmanagement",
    "startDate": "12.12.2025",
    "endDate": "18.12.2025",
    "ue": 45,
    "tags": ["Projektmanagement", "Scrum"]
  },
  {
    "title": "Projekt",
    "courseName": "Agiles Projektmanagement",
    "startDate": "19.12.2025",
    "endDate": "19.12.2025",
    "ue": 9,
    "tags": ["Projektmanagement"]
  },
  {
    "title": "Zertifizierungsvorbereitung",
    "courseName": "Agiles Projektmanagement",
    "startDate": "22.12.2025",
    "endDate": "22.12.2025",
    "ue": 9,
    "tags": ["Projektmanagement", "Zertifizierung"]
  },
];

// Group topics by Course
interface CourseGroup {
  name: string;
  startDate: Date;
  endDate: Date;
  topics: {
      title: string;
      courseName: string;
      startDate: string;
      endDate: string;
      ue: number;
      tags: string[];
  }[];
  tags: Set<string>;
}

function groupTopicsByCourse(topics: {
    title: string;
    courseName: string;
    startDate: string;
    endDate: string;
    ue: number;
    tags: string[];
}[]): CourseGroup[] {
  const groups: { [key: string]: CourseGroup } = {};

  for (const t of topics) {
    const start = parseDate(t.startDate);
    const end = parseDate(t.endDate);

    if (!groups[t.courseName]) {
      groups[t.courseName] = {
        name: t.courseName,
        startDate: start,
        endDate: end,
        topics: [],
        tags: new Set()
      };
    } else {
      // Update min/max dates
      if (start < groups[t.courseName].startDate) groups[t.courseName].startDate = start;
      if (end > groups[t.courseName].endDate) groups[t.courseName].endDate = end;
    }
    groups[t.courseName].topics.push(t);
    if (t.tags) {
        t.tags.forEach((tag: string) => groups[t.courseName].tags.add(tag));
    }
  }

  return Object.values(groups);
}

async function main() {
  console.log('Start seeding...');
  
  // Clean up - Order matters due to foreign keys!
  // 1. Delete dependent child records
  await prisma.teacherSkill.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.notification.deleteMany() // Neu hinzugefügt
  await prisma.timeEntry.deleteMany()
  await prisma.bulletinPost.deleteMany()
  
  // 2. Delete Course related
  await prisma.courseInvitation.deleteMany() // Neu hinzugefügt (falls vorhanden)
  await prisma.exam.deleteMany()
  await prisma.courseEvent.deleteMany()
  await prisma.courseTopic.deleteMany()
  await prisma.courseTag.deleteMany()
  await prisma.course.deleteMany()

  // 3. Delete independent entities
  await prisma.educationTrack.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.room.deleteMany()
  await prisma.announcement.deleteMany() // Neu hinzugefügt

  // 4. Finally delete users
  await prisma.user.deleteMany()

  // 0. Create Rooms
  // const room1 = await prisma.room.create({ data: { name: 'Raum 101 (Theorie)', capacity: 30 } });
  // const room2 = await prisma.room.create({ data: { name: 'Raum 204 (IT-Labor)', capacity: 25 } });
  // const roomRemote = await prisma.room.create({ data: { name: 'Remote / Telelearning', capacity: 100 } });
  
  // Note: Rooms are currently unused in logic but created for future use. 
  // Commenting out variable assignment to suppress unused warning, or just create without assigning.
  await prisma.room.create({ data: { name: 'Raum 101 (Theorie)', capacity: 30 } });
  await prisma.room.create({ data: { name: 'Raum 204 (IT-Labor)', capacity: 25 } });
  await prisma.room.create({ data: { name: 'Remote / Telelearning', capacity: 100 } });

  // 1. Create Education Track
  const track = await prisma.educationTrack.create({
    data: {
      title: 'Fachinformatiker Anwendungsentwicklung - Winter 2025',
      startDate: parseDate("03.02.2025"),
      endDate: parseDate("02.02.2027")
    }
  });

  // 1.5 Create Tags
  const allTags = new Set<string>();
  rawTopics.forEach(t => t.tags?.forEach(tag => allTags.add(tag)));
  allTags.add("Wirtschaft"); // Extra tag for BWL specific
  
  const createdTags: Record<string, string> = {}; // Name -> ID

  for (const tagName of Array.from(allTags)) {
    const tag = await prisma.tag.create({ data: { name: tagName } });
    createdTags[tagName] = tag.id;
  }
  console.log('Tags created:', Object.keys(createdTags).length);

  // 2. Create Users
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Is TrAItor',
      email: 'admin@cc-corp.de',
      role: 'admin',
      department: 'IT-Administration'
    },
  })
  // Suppress unused warning for admin if not used later, but usually good to keep reference.
  // Actually, 'admin' is unused.
  console.log('Admin created:', admin.email);

  // Staff (Office)
  const office = await prisma.user.create({
    data: {
      name: 'Susi Sorglos',
      email: 'office@cc-corp.de',
      role: 'staff',
      department: 'Schulungsverwaltung'
    },
  })
  console.log('Office created:', office.email);

  // Teacher 1 (Code) - Has ALL tags
  const profCode = await prisma.user.create({
    data: {
      name: 'Prof. Dr. Code',
      email: 'prof-code@cc-corp.de',
      role: 'teacher',
      teacherSkills: {
        create: Object.values(createdTags).map(tagId => ({
            tagId: tagId,
            isVerified: true,
            isActive: true
        }))
      }
    },
  })

  // Teacher 2 (BWL) - Has only BWL/Wirtschaft tags
  const bwlTags = ["BWL", "Wirtschaft", "Recht", "Rechnungswesen", "Kommunikation"];
  const drBwl = await prisma.user.create({
    data: {
      name: 'Dr. Bilanz',
      email: 'bwl@cc-corp.de',
      role: 'teacher',
      teacherSkills: {
         create: bwlTags
            .filter(t => createdTags[t])
            .map(t => ({
                tagId: createdTags[t],
                isVerified: true,
                isActive: true
            }))
      }
    },
  })
  
  // Student 1
  const marc = await prisma.user.create({
    data: {
      name: 'Marc Mustermann',
      email: 'marc@cc-student.de',
      role: 'student',
      measureNumber: '666/777/2025',
      educationTrackId: track.id
    },
  })

  // Student 2
  const anna = await prisma.user.create({
    data: {
      name: 'Anna Anständig',
      email: 'anna@cc-student.de',
      role: 'student',
      measureNumber: '111/222/2025',
      educationTrackId: track.id
    },
  })

  // 2.5 Create 26 more Students with Time Entries
  console.log('👥 Seeding students and time entries (this might take a moment)...');
  
  const today = new Date('2026-01-13'); // Fixed "today" per requirement
  const seedStartDate = new Date('2025-09-01');
  
  // Helper to generate dates between start and end excluding weekends
  const getWorkingDays = (start: Date, end: Date) => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0=Sun, 6=Sat
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const workingDays = getWorkingDays(seedStartDate, today);

  for (let i = 1; i <= 26; i++) {
    const studentNum = i.toString().padStart(2, '0');
    const studentEmail = `student${studentNum}@example.com`;
    
    // Create/Update Student
    const student = await prisma.user.upsert({
      where: { email: studentEmail },
      update: {
        educationTrackId: track.id, // Ensure they are in the track if they exist
      },
      create: {
        name: `Student ${studentNum}`,
        email: studentEmail,
        role: 'student',
        educationTrackId: track.id,
        measureNumber: `123/45${studentNum}/2025`,
      },
    });

    // Check if we already have time entries to avoid duplication on re-runs
    const entryCount = await prisma.timeEntry.count({
      where: { userId: student.id }
    });

    if (entryCount === 0) {
      const timeEntriesData = workingDays.map(day => {
        // Randomize start time between 7:45 and 8:15
        const startHour = 7;
        const startMinute = 45 + Math.floor(Math.random() * 30);
        
        const clockIn = new Date(day);
        clockIn.setHours(startHour, startMinute, 0);

        // Randomize duration between 8h and 8h 30m (480 - 510 mins)
        // Let's assume ~8.5h presence including break.
        const durationMinutes = 480 + Math.floor(Math.random() * 30); // ~8 hours work
        
        const clockOut = new Date(clockIn);
        clockOut.setMinutes(clockOut.getMinutes() + durationMinutes + 45); // +45min break roughly

        return {
          userId: student.id,
          clockIn: clockIn,
          clockOut: clockOut,
          duration: durationMinutes, // Net work time
          location: Math.random() > 0.8 ? 'REMOTE' : 'ON_SITE',
        };
      });

      // Prisma createMany is faster
      await prisma.timeEntry.createMany({
        data: timeEntriesData,
      });
    }
    
    process.stdout.write('.'); // Progress indicator
  }
  console.log('\n✅ Students seeded.');


  console.log('Users & Track created.');

  // 3. Create Courses and Topics
  const courses = groupTopicsByCourse(rawTopics);

  for (const c of courses) {
    // Determine teacher (Matching by Tag)
    // Find teacher who has at least one tag of the course
    const courseTags = Array.from(c.tags);
    const teachersConnect = [];
    
    // Simple logic: if course has BWL tag, assign Dr. Bilanz. Else Prof Code (who has everything anyway)
    // But to follow requirements: Prof Code gets ALL tags, so he fits everywhere.
    // Dr Bilanz only fits BWL.
    
    const fitsBwl = courseTags.some(t => bwlTags.includes(t));
    
    // Assign Prof Code everywhere (as he has all tags)
    teachersConnect.push({ id: profCode.id });
    
    // Assign Dr. Bilanz only if it fits his skills
    if (fitsBwl) {
         teachersConnect.push({ id: drBwl.id });
    }

    const createdCourse = await prisma.course.create({
      data: {
        title: c.name,
        startDate: c.startDate,
        endDate: c.endDate,
        educationTrackId: track.id,
        students: {
          connect: [{ id: marc.id }, { id: anna.id }]
        },
        teachers: {
          connect: teachersConnect
        },
        // Tags
        tags: {
            create: courseTags.map(tagName => ({
                tag: {
                    connect: { id: createdTags[tagName] }
                }
            }))
        },
        // Topics
        topics: {
          create: c.topics.map(t => ({
            title: t.title,
            durationUnits: t.ue,
            startDate: parseDate(t.startDate),
            endDate: parseDate(t.endDate)
          }))
        }
      }
    });

    // Check if any topic is a "Klausur" and create Exam entity
    for (const t of c.topics) {
      if (t.title.includes("Klausur") || t.title.includes("Prüfung")) {
        await prisma.exam.create({
          data: {
            title: `${c.name} - ${t.title}`,
            date: parseDate(t.startDate, "10:00:00"),
            duration: 90, // Standard duration
            content: "Prüfungsinhalte gemäß Modulbeschreibung",
            location: "Raum 101",
            courseId: createdCourse.id
          }
        });
      }
    }
  }

  console.log(`Created ${courses.length} courses with topics.`);

  // 4. Create dummy grade
  const firstExam = await prisma.exam.findFirst();
  if (firstExam) {
     await prisma.grade.create({
       data: {
         userId: marc.id,
         examId: firstExam.id,
         subject: firstExam.title,
         value: 1.3,
         date: new Date()
       }
     });
     console.log('Created sample grade for Marc.');
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
