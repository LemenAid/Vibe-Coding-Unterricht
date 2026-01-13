import { PrismaClient } from '../generated-client'

const prisma = new PrismaClient()

function parseDate(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

const courseData = [
  {
    "title": "Fachbezogenes Rechnen",
    "description": "Einführung fachbezogenes Rechnen / Digitaltechnik - Fachbezogenes Rechnen",
    "startDate": "03.02.2025",
    "endDate": "07.02.2025"
  },
  {
    "title": "Digitaltechnik",
    "description": "Einführung fachbezogenes Rechnen / Digitaltechnik - Digitaltechnik",
    "startDate": "10.02.2025",
    "endDate": "12.02.2025"
  },
  {
    "title": "Einführung Programmierung",
    "description": "Einführung Programmierung - Einführung Programmierung",
    "startDate": "13.02.2025",
    "endDate": "21.02.2025"
  },
  {
    "title": "Einführung Datenbanken",
    "description": "Einführung Datenbanken - Einführung Datenbanken",
    "startDate": "24.02.2025",
    "endDate": "04.03.2025"
  },
  {
    "title": "Verkabelung",
    "description": "Einführung Netzwerktechnik - Verkabelung",
    "startDate": "05.03.2025",
    "endDate": "06.03.2025"
  },
  {
    "title": "Netzwerkgrundlagen",
    "description": "Einführung Netzwerktechnik - Netzwerkgrundlagen",
    "startDate": "07.03.2025",
    "endDate": "11.03.2025"
  },
  {
    "title": "Ethernet",
    "description": "Einführung Netzwerktechnik - Ethernet",
    "startDate": "12.03.2025",
    "endDate": "12.03.2025"
  },
  {
    "title": "Kommunikationsprotokolle",
    "description": "Einführung Netzwerktechnik - Kommunikationsprotokolle",
    "startDate": "13.03.2025",
    "endDate": "14.03.2025"
  },
  {
    "title": "Arbeitsorganisation und -techniken",
    "description": "Allgemeine Betriebswirtschaftslehre - Arbeitsorganisation und -techniken",
    "startDate": "17.03.2025",
    "endDate": "18.03.2025"
  },
  {
    "title": "Sicherheit, Gesundheits- und Umweltschutz",
    "description": "Allgemeine Betriebswirtschaftslehre - Sicherheit, Gesundheits- und Umweltschutz",
    "startDate": "18.03.2025",
    "endDate": "19.03.2025"
  },
  {
    "title": "Prozessorganisation und -ablauf",
    "description": "Allgemeine Betriebswirtschaftslehre - Prozessorganisation und -ablauf",
    "startDate": "20.03.2025",
    "endDate": "21.03.2025"
  },
  {
    "title": "Informieren und Beraten von Kunden/Kundinnen",
    "description": "Allgemeine Betriebswirtschaftslehre - Informieren und Beraten von Kunden/Kundinnen",
    "startDate": "24.03.2025",
    "endDate": "26.03.2025"
  },
  {
    "title": "Kommunikation und vernetztes Zusammenarbeiten unter Nutzung digitaler Medien",
    "description": "Allgemeine Betriebswirtschaftslehre - Kommunikation und vernetztes Zusammenarbeiten unter Nutzung digitaler Medien",
    "startDate": "27.03.2025",
    "endDate": "31.03.2025"
  },
  {
    "title": "Klausur",
    "description": "Allgemeine Betriebswirtschaftslehre - Klausur",
    "startDate": "01.04.2025",
    "endDate": "01.04.2025"
  },
  {
    "title": "Grundlagen Qualitätsmanagement und Qualitätssicherung",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I - Grundlagen Qualitätsmanagement und Qualitätssicherung",
    "startDate": "02.04.2025",
    "endDate": "04.04.2025"
  },
  {
    "title": "Maßnahmen und Anforderungen zur IT-Sicherheit und Datenschutz",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I - Maßnahmen und Anforderungen zur IT-Sicherheit und Datenschutz",
    "startDate": "07.04.2025",
    "endDate": "11.04.2025"
  },
  {
    "title": "Klausur",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I - Klausur",
    "startDate": "14.04.2025",
    "endDate": "14.04.2025"
  },
  {
    "title": "Refresh Digitaltechnik",
    "description": "Netzwerk- und Kommunikationstechnik - Refresh Digitaltechnik",
    "startDate": "15.04.2025",
    "endDate": "17.04.2025"
  },
  {
    "title": "Kommunikationsgrundlagen",
    "description": "Netzwerk- und Kommunikationstechnik - Kommunikationsgrundlagen",
    "startDate": "28.04.2025",
    "endDate": "29.04.2025"
  },
  {
    "title": "Transportorientierte Schichten",
    "description": "Netzwerk- und Kommunikationstechnik - Transportorientierte Schichten",
    "startDate": "29.04.2025",
    "endDate": "30.04.2025"
  },
  {
    "title": "Transportorientierte Schichten",
    "description": "Netzwerk- und Kommunikationstechnik - Transportorientierte Schichten",
    "startDate": "02.05.2025",
    "endDate": "05.05.2025"
  },
  {
    "title": "Internetkommunikation",
    "description": "Netzwerk- und Kommunikationstechnik - Internetkommunikation",
    "startDate": "05.05.2025",
    "endDate": "07.05.2025"
  },
  {
    "title": "Anwendungsorientierte Schichten",
    "description": "Netzwerk- und Kommunikationstechnik - Anwendungsorientierte Schichten",
    "startDate": "08.05.2025",
    "endDate": "12.05.2025"
  },
  {
    "title": "Hardware und Sicherheit",
    "description": "Netzwerk- und Kommunikationstechnik - Hardware und Sicherheit",
    "startDate": "13.05.2025",
    "endDate": "14.05.2025"
  },
  {
    "title": "Öffentliche Kommunikationsnetze",
    "description": "Netzwerk- und Kommunikationstechnik - Öffentliche Kommunikationsnetze",
    "startDate": "14.05.2025",
    "endDate": "14.05.2025"
  },
  {
    "title": "Vermittlungstechnik",
    "description": "Netzwerk- und Kommunikationstechnik - Vermittlungstechnik",
    "startDate": "15.05.2025",
    "endDate": "15.05.2025"
  },
  {
    "title": "Mobilfunk",
    "description": "Netzwerk- und Kommunikationstechnik - Mobilfunk",
    "startDate": "16.05.2025",
    "endDate": "16.05.2025"
  },
  {
    "title": "Satellitennetze, GPS",
    "description": "Netzwerk- und Kommunikationstechnik - Satellitennetze, GPS",
    "startDate": "16.05.2025",
    "endDate": "16.05.2025"
  },
  {
    "title": "Klausur",
    "description": "Netzwerk- und Kommunikationstechnik - Klausur",
    "startDate": "19.05.2025",
    "endDate": "19.05.2025"
  },
  {
    "title": "marktgängige IT-Systeme für unterschiedliche Einsatzbereich hinsichtlich Leistungsfähigkeit, Wirtschaftlichkeit und Barrierefreiheit beurteilen",
    "description": "Systemtechnik Teil I - marktgängige IT-Systeme für unterschiedliche Einsatzbereich hinsichtlich Leistungsfähigkeit, Wirtschaftlichkeit und Barrierefreiheit beurteilen",
    "startDate": "20.05.2025",
    "endDate": "23.05.2025"
  },
  {
    "title": "Angebote zu IT-Komponenten, IT-Produkten und IT-Dienstleistungen einholen und bewerten sowie Spezifikationen und Konditionen vergleichen",
    "description": "Systemtechnik Teil I - Angebote zu IT-Komponenten, IT-Produkten und IT-Dienstleistungen einholen und bewerten sowie Spezifikationen und Konditionen vergleichen",
    "startDate": "23.05.2025",
    "endDate": "27.05.2025"
  },
  {
    "title": "IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "description": "Systemtechnik Teil I - IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "startDate": "27.05.2025",
    "endDate": "28.05.2025"
  },
  {
    "title": "IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "description": "Systemtechnik Teil I - IT-Systeme analysieren, unter Beacht. insb. von Lizenzmodellen, Urheberrechten, Barrierefreiheit konzeptionieren,konfigurieren, testen, dokumentieren",
    "startDate": "30.05.2025",
    "endDate": "30.05.2025"
  },
  {
    "title": "Klausur",
    "description": "Systemtechnik Teil I - Klausur",
    "startDate": "02.06.2025",
    "endDate": "02.06.2025"
  },
  {
    "title": "Leistungen nach betrieblichen und vertraglichen Vorgaben dokumentieren",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Leistungen nach betrieblichen und vertraglichen Vorgaben dokumentieren",
    "startDate": "03.06.2025",
    "endDate": "04.06.2025"
  },
  {
    "title": "Leistungserbringung unter Berücksichtigung organisatorischer/terminlicher Vorgaben mit Kunden und Kundinnen abstimmen und kontrollieren",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Leistungserbringung unter Berücksichtigung organisatorischer/terminlicher Vorgaben mit Kunden und Kundinnen abstimmen und kontrollieren",
    "startDate": "05.06.2025",
    "endDate": "06.06.2025"
  },
  {
    "title": "Veränderungsprozesse begleiten und unterstützen",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Veränderungsprozesse begleiten und unterstützen",
    "startDate": "06.06.2025",
    "endDate": "06.06.2025"
  },
  {
    "title": "Veränderungsprozesse begleiten und unterstützen",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Veränderungsprozesse begleiten und unterstützen",
    "startDate": "10.06.2025",
    "endDate": "10.06.2025"
  },
  {
    "title": "Einweisung von Kunden/Kundinnen in die Nutzung von Produkten und Dienstleistungen, Leistungen/Dokumentationen übergeben, Abnahmeprotokolle anfertigen",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Einweisung von Kunden/Kundinnen in die Nutzung von Produkten und Dienstleistungen, Leistungen/Dokumentationen übergeben, Abnahmeprotokolle anfertigen",
    "startDate": "10.06.2025",
    "endDate": "12.06.2025"
  },
  {
    "title": "Kosten für erbrachte Leistungen erfassen sowie im Zeitvergleich und im Soll-Ist-Vergleich bewerten",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Kosten für erbrachte Leistungen erfassen sowie im Zeitvergleich und im Soll-Ist-Vergleich bewerten",
    "startDate": "12.06.2025",
    "endDate": "17.06.2025"
  },
  {
    "title": "Kommunikation und Kundenbeziehungen",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Kommunikation und Kundenbeziehungen",
    "startDate": "17.06.2025",
    "endDate": "18.06.2025"
  },
  {
    "title": "Klausur",
    "description": "Leistungserbringung /-bewertung, Kundenbeziehungsmanagement - Klausur",
    "startDate": "20.06.2025",
    "endDate": "20.06.2025"
  },
  {
    "title": "SAP Überblick",
    "description": "Branchenspezifische ERP-Software - SAP Überblick",
    "startDate": "23.06.2025",
    "endDate": "30.06.2025"
  },
  {
    "title": "Zertifizierungsvorbereitung",
    "description": "Branchenspezifische ERP-Software - Zertifizierungsvorbereitung",
    "startDate": "01.07.2025",
    "endDate": "02.07.2025"
  },
  {
    "title": "SAP-Zertifizierung (optional)",
    "description": "Branchenspezifische ERP-Software - SAP-Zertifizierung (optional)",
    "startDate": "03.07.2025",
    "endDate": "03.07.2025"
  },
  {
    "title": "Technisches Englisch",
    "description": "Technisches Englisch - Technisches Englisch",
    "startDate": "04.07.2025",
    "endDate": "15.07.2025"
  },
  {
    "title": "Klausur",
    "description": "Technisches Englisch - Klausur",
    "startDate": "16.07.2025",
    "endDate": "16.07.2025"
  },
  {
    "title": "Grundlagen",
    "description": "Prozedurale und Objektorientierte Programmierung - Grundlagen",
    "startDate": "17.07.2025",
    "endDate": "18.07.2025"
  },
  {
    "title": "Refresh Programmierungsgrundlagen",
    "description": "Prozedurale und Objektorientierte Programmierung - Refresh Programmierungsgrundlagen",
    "startDate": "21.07.2025",
    "endDate": "21.07.2025"
  },
  {
    "title": "Programmiertechniken/-methoden",
    "description": "Prozedurale und Objektorientierte Programmierung - Programmiertechniken/-methoden",
    "startDate": "22.07.2025",
    "endDate": "28.07.2025"
  },
  {
    "title": "Abgrenzung prozedurale zu objektorientierter Programmierung",
    "description": "Prozedurale und Objektorientierte Programmierung - Abgrenzung prozedurale zu objektorientierter Programmierung",
    "startDate": "29.07.2025",
    "endDate": "29.07.2025"
  },
  {
    "title": "Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "description": "Prozedurale und Objektorientierte Programmierung - Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "startDate": "30.07.2025",
    "endDate": "01.08.2025"
  },
  {
    "title": "Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "description": "Prozedurale und Objektorientierte Programmierung - Einführung in das objektorientierte Paradigma (Java, C# oder C++ als Anschauungssprache)",
    "startDate": "18.08.2025",
    "endDate": "18.08.2025"
  },
  {
    "title": "Analyse und Design",
    "description": "Prozedurale und Objektorientierte Programmierung - Analyse und Design",
    "startDate": "18.08.2025",
    "endDate": "20.08.2025"
  },
  {
    "title": "UML",
    "description": "Prozedurale und Objektorientierte Programmierung - UML",
    "startDate": "20.08.2025",
    "endDate": "25.08.2025"
  },
  {
    "title": "Lösungen konkreter Problemstellungen - prozedural und objektorientiert implementieren",
    "description": "Prozedurale und Objektorientierte Programmierung - Lösungen konkreter Problemstellungen - prozedural und objektorientiert implementieren",
    "startDate": "25.08.2025",
    "endDate": "29.08.2025"
  },
  {
    "title": "Testverfahren/-konzepte",
    "description": "Prozedurale und Objektorientierte Programmierung - Testverfahren/-konzepte",
    "startDate": "01.09.2025",
    "endDate": "01.09.2025"
  },
  {
    "title": "Klausur",
    "description": "Prozedurale und Objektorientierte Programmierung - Klausur",
    "startDate": "02.09.2025",
    "endDate": "02.09.2025"
  },
  {
    "title": "Refresh Datenbankmodelle",
    "description": "Datenbanken - Refresh Datenbankmodelle",
    "startDate": "03.09.2025",
    "endDate": "03.09.2025"
  },
  {
    "title": "Datenbankdesign",
    "description": "Datenbanken - Datenbankdesign",
    "startDate": "04.09.2025",
    "endDate": "09.09.2025"
  },
  {
    "title": "SQL",
    "description": "Datenbanken - SQL",
    "startDate": "09.09.2025",
    "endDate": "17.09.2025"
  },
  {
    "title": "Klausur",
    "description": "Datenbanken - Klausur",
    "startDate": "18.09.2025",
    "endDate": "18.09.2025"
  },
  {
    "title": "technologische Entwicklungstrends von IT-Systemen feststellen sowie ihre wirtschaftlichen, sozialen und beruflichen Auswirkungen aufzeigen",
    "description": "Systemtechnik Teil II - technologische Entwicklungstrends von IT-Systemen feststellen sowie ihre wirtschaftlichen, sozialen und beruflichen Auswirkungen aufzeigen",
    "startDate": "19.09.2025",
    "endDate": "23.09.2025"
  },
  {
    "title": "Veränderungen von Einsatzfeldern für IT-Systeme aufgrund technischer, wirtschaftlicher und gesellschaftlicher Entwicklungen feststellen",
    "description": "Systemtechnik Teil II - Veränderungen von Einsatzfeldern für IT-Systeme aufgrund technischer, wirtschaftlicher und gesellschaftlicher Entwicklungen feststellen",
    "startDate": "23.09.2025",
    "endDate": "24.09.2025"
  },
  {
    "title": "Qualitätsmessung, -überwachung und -verbesserung",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II - Qualitätsmessung, -überwachung und -verbesserung",
    "startDate": "25.09.2025",
    "endDate": "30.09.2025"
  },
  {
    "title": "IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II - IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "startDate": "01.10.2025",
    "endDate": "02.10.2025"
  },
  {
    "title": "IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II - IT-Sicherheit und Datenschutz: Bedrohungsszenarien, Schadenspotenziale und Maßnahmenwirksamkeit",
    "startDate": "06.10.2025",
    "endDate": "08.10.2025"
  },
  {
    "title": "Klausur",
    "description": "Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II - Klausur",
    "startDate": "09.10.2025",
    "endDate": "09.10.2025"
  },
  {
    "title": "Berufliche Bildung im dualen System; Arbeits- und Tarifrecht",
    "description": "Fachrichtungsübergreifendes Modul I - Berufliche Bildung im dualen System; Arbeits- und Tarifrecht",
    "startDate": "10.10.2025",
    "endDate": "10.10.2025"
  },
  {
    "title": "Betreiben von IT-Systemen",
    "description": "Fachrichtungsübergreifendes Modul I - Betreiben von IT-Systemen",
    "startDate": "13.10.2025",
    "endDate": "15.10.2025"
  },
  {
    "title": "Programmieren von Softwarelösungen",
    "description": "Fachrichtungsübergreifendes Modul I - Programmieren von Softwarelösungen",
    "startDate": "16.10.2025",
    "endDate": "21.10.2025"
  },
  {
    "title": "Vorgehensmodelle und -methoden sowie Entwicklungsumgebungen und -bibliotheken auswählen und einsetzen",
    "description": "Fachspezifisches Modul I - Vorgehensmodelle und -methoden sowie Entwicklungsumgebungen und -bibliotheken auswählen und einsetzen",
    "startDate": "22.10.2025",
    "endDate": "23.10.2025"
  },
  {
    "title": "Analyse- und Designverfahren anwenden",
    "description": "Fachspezifisches Modul I - Analyse- und Designverfahren anwenden",
    "startDate": "23.10.2025",
    "endDate": "30.10.2025"
  },
  {
    "title": "Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "description": "Fachspezifisches Modul I - Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "startDate": "30.10.2025",
    "endDate": "30.10.2025"
  },
  {
    "title": "Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "description": "Fachspezifisches Modul I - Benutzerschnittstellen ergonomisch gestalten und an Kundenanforderungen anpassen",
    "startDate": "03.11.2025",
    "endDate": "07.11.2025"
  },
  {
    "title": "Sicherheitsaspekte bei der Entwicklung von Softwareanwendungen berücksichtigen",
    "description": "Fachspezifisches Modul I - Sicherheitsaspekte bei der Entwicklung von Softwareanwendungen berücksichtigen",
    "startDate": "07.11.2025",
    "endDate": "10.11.2025"
  },
  {
    "title": "Datenintegrität mithilfe von Werkzeugen sicherstellen",
    "description": "Fachspezifisches Modul I - Datenintegrität mithilfe von Werkzeugen sicherstellen",
    "startDate": "10.11.2025",
    "endDate": "11.11.2025"
  },
  {
    "title": "Modultests erstellen und durchführen",
    "description": "Fachspezifisches Modul I - Modultests erstellen und durchführen",
    "startDate": "11.11.2025",
    "endDate": "12.11.2025"
  },
  {
    "title": "Klausur",
    "description": "Fachspezifisches Modul I - Klausur",
    "startDate": "13.11.2025",
    "endDate": "13.11.2025"
  },
  {
    "title": "Cloud-Konzepte",
    "description": "Branchenspezifische Cloud-Lösungen - Cloud-Konzepte",
    "startDate": "14.11.2025",
    "endDate": "17.11.2025"
  },
  {
    "title": "Sicherheit und Compliance",
    "description": "Branchenspezifische Cloud-Lösungen - Sicherheit und Compliance",
    "startDate": "17.11.2025",
    "endDate": "18.11.2025"
  },
  {
    "title": "Sicherheit und Compliance",
    "description": "Branchenspezifische Cloud-Lösungen - Sicherheit und Compliance",
    "startDate": "20.11.2025",
    "endDate": "20.11.2025"
  },
  {
    "title": "Cloud-Technologie und -Services",
    "description": "Branchenspezifische Cloud-Lösungen - Cloud-Technologie und -Services",
    "startDate": "20.11.2025",
    "endDate": "24.11.2025"
  },
  {
    "title": "Fakturierung, Preisgestaltung und Support",
    "description": "Branchenspezifische Cloud-Lösungen - Fakturierung, Preisgestaltung und Support",
    "startDate": "25.11.2025",
    "endDate": "25.11.2025"
  },
  {
    "title": "Prüfung AWS Certified Cloud Practitioner (CLF-C02)",
    "description": "Branchenspezifische Cloud-Lösungen - Prüfung AWS Certified Cloud Practitioner (CLF-C02)",
    "startDate": "26.11.2025",
    "endDate": "26.11.2025"
  },
  {
    "title": "Einführung Projektmanagement",
    "description": "Projektmanagement und Projektarbeit - Einführung Projektmanagement",
    "startDate": "27.11.2025",
    "endDate": "27.11.2025"
  },
  {
    "title": "Definitionsphase",
    "description": "Projektmanagement und Projektarbeit - Definitionsphase",
    "startDate": "28.11.2025",
    "endDate": "01.12.2025"
  },
  {
    "title": "Planungsphase",
    "description": "Projektmanagement und Projektarbeit - Planungsphase",
    "startDate": "01.12.2025",
    "endDate": "02.12.2025"
  },
  {
    "title": "Realisierungsphase",
    "description": "Projektmanagement und Projektarbeit - Realisierungsphase",
    "startDate": "03.12.2025",
    "endDate": "04.12.2025"
  },
  {
    "title": "Abschlussphase",
    "description": "Projektmanagement und Projektarbeit - Abschlussphase",
    "startDate": "04.12.2025",
    "endDate": "04.12.2025"
  },
  {
    "title": "Projektarbeit: Anwendung/Umsetzung der fachspezifischen Projektmanagementinhalte",
    "description": "Projektmanagement und Projektarbeit - Projektarbeit: Anwendung/Umsetzung der fachspezifischen Projektmanagementinhalte",
    "startDate": "05.12.2025",
    "endDate": "10.12.2025"
  },
  {
    "title": "Überblick agiles Projektmanagement",
    "description": "Agiles Projektmanagement - Überblick agiles Projektmanagement",
    "startDate": "11.12.2025",
    "endDate": "11.12.2025"
  },
  {
    "title": "Projektmanagement mit SCRUM",
    "description": "Agiles Projektmanagement - Projektmanagement mit SCRUM",
    "startDate": "12.12.2025",
    "endDate": "18.12.2025"
  },
  {
    "title": "Projekt",
    "description": "Agiles Projektmanagement - Projekt",
    "startDate": "19.12.2025",
    "endDate": "19.12.2025"
  },
  {
    "title": "Zertifizierungsvorbereitung",
    "description": "Agiles Projektmanagement - Zertifizierungsvorbereitung",
    "startDate": "22.12.2025",
    "endDate": "22.12.2025"
  },
  {
    "title": "Aufbau und Organisation des Ausbildungsbetriebes",
    "description": "Fachrichtungsübergreifendes Modul II - Aufbau und Organisation des Ausbildungsbetriebes",
    "startDate": "08.01.2026",
    "endDate": "08.01.2026"
  },
  {
    "title": "Sicherheit, Gesundheits- und Umweltschutz",
    "description": "Fachrichtungsübergreifendes Modul II - Sicherheit, Gesundheits- und Umweltschutz",
    "startDate": "09.01.2026",
    "endDate": "09.01.2026"
  },
  {
    "title": "Vertiefung: Betreiben von IT-Systemen",
    "description": "Fachrichtungsübergreifendes Modul II - Vertiefung: Betreiben von IT-Systemen",
    "startDate": "09.01.2026",
    "endDate": "13.01.2026"
  },
  {
    "title": "Inbetriebnehmen von Speicherlösungen",
    "description": "Fachrichtungsübergreifendes Modul II - Inbetriebnehmen von Speicherlösungen",
    "startDate": "14.01.2026",
    "endDate": "19.01.2026"
  },
  {
    "title": "Vertiefung: Programmieren von Softwarelösungen",
    "description": "Fachrichtungsübergreifendes Modul II - Vertiefung: Programmieren von Softwarelösungen",
    "startDate": "19.01.2026",
    "endDate": "27.01.2026"
  },
  {
    "title": "Klausur",
    "description": "Fachrichtungsübergreifendes Modul II - Klausur",
    "startDate": "28.01.2026",
    "endDate": "28.01.2026"
  },
  {
    "title": "Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren",
    "description": "Fachspezifisches Modul II Teil 1 - Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren",
    "startDate": "29.01.2026",
    "endDate": "11.02.2026"
  },
  {
    "title": "Wiederholung des prüfungsrelevanten Stoffes: Einrichten eines IT-gestützten Arbeitsplatzes",
    "description": "Vorbereitung schriftliche Prüfung Teil 1: Einrichten eines IT-gestützten Arbeitsplatzes - Wiederholung des prüfungsrelevanten Stoffes: Einrichten eines IT-gestützten Arbeitsplatzes",
    "startDate": "12.02.2026",
    "endDate": "25.02.2026"
  },
  {
    "title": "Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren",
    "description": "Fachspezifisches Modul II Teil 2 - Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren",
    "startDate": "26.02.2026",
    "endDate": "04.03.2026"
  },
  {
    "title": "bestehende Anwendungslösungen anpassen",
    "description": "Fachspezifisches Modul II Teil 2 - bestehende Anwendungslösungen anpassen",
    "startDate": "05.03.2026",
    "endDate": "09.03.2026"
  },
  {
    "title": "Datenaustausch zwischen Systemen realisieren und unterschiedliche Datenquellen nutzen",
    "description": "Fachspezifisches Modul II Teil 2 - Datenaustausch zwischen Systemen realisieren und unterschiedliche Datenquellen nutzen",
    "startDate": "10.03.2026",
    "endDate": "11.03.2026"
  },
  {
    "title": "komplexe Abfragen aus unterschiedlichen Datenquellen durchführen und Datenbestandsberichte erstellen",
    "description": "Fachspezifisches Modul II Teil 2 - komplexe Abfragen aus unterschiedlichen Datenquellen durchführen und Datenbestandsberichte erstellen",
    "startDate": "12.03.2026",
    "endDate": "16.03.2026"
  },
  {
    "title": "Werkzeuge zur Versionsverwaltung einsetzen",
    "description": "Fachspezifisches Modul II Teil 2 - Werkzeuge zur Versionsverwaltung einsetzen",
    "startDate": "17.03.2026",
    "endDate": "19.03.2026"
  },
  {
    "title": "Testkonzepte erstellen und Tests durchführen sowie Testergebnisse bewerten und dokumentieren",
    "description": "Fachspezifisches Modul II Teil 2 - Testkonzepte erstellen und Tests durchführen sowie Testergebnisse bewerten und dokumentieren",
    "startDate": "19.03.2026",
    "endDate": "20.03.2026"
  },
  {
    "title": "Daten/Sachverhalte aus Tests multimedial aufbereiten und situationsg. unter Nutzung digit. Werkzeuge u. unter Beachtung betr. Vorgaben präsentieren",
    "description": "Fachspezifisches Modul II Teil 2 - Daten/Sachverhalte aus Tests multimedial aufbereiten und situationsg. unter Nutzung digit. Werkzeuge u. unter Beachtung betr. Vorgaben präsentieren",
    "startDate": "23.03.2026",
    "endDate": "23.03.2026"
  },
  {
    "title": "Klausur",
    "description": "Fachspezifisches Modul II Teil 2 - Klausur",
    "startDate": "24.03.2026",
    "endDate": "24.03.2026"
  },
  {
    "title": "Wiederholung des prüfungsrelevanten Stoffes",
    "description": "Vorbereitung schriftliche Prüfung Teil 2 - Wiederholung des prüfungsrelevanten Stoffes",
    "startDate": "08.09.2026",
    "endDate": "02.10.2026"
  },
  {
    "title": "Wiederholung des prüfungsrelevanten Stoffes",
    "description": "Vorbereitung schriftliche Prüfung Teil 2 - Wiederholung des prüfungsrelevanten Stoffes",
    "startDate": "05.10.2026",
    "endDate": "09.10.2026"
  },
  {
    "title": "Wiederholung des prüfungsrelevanten Stoffes",
    "description": "Vorbereitung schriftliche Prüfung Teil 2 - Wiederholung des prüfungsrelevanten Stoffes",
    "startDate": "02.11.2026",
    "endDate": "17.11.2026"
  },
  {
    "title": "Wiederholung des prüfungsrelevanten Stoffes",
    "description": "Vorbereitung schriftliche Prüfung Teil 2 - Wiederholung des prüfungsrelevanten Stoffes",
    "startDate": "19.11.2026",
    "endDate": "25.11.2026"
  },
  {
    "title": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen",
    "description": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen - Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen",
    "startDate": "30.11.2026",
    "endDate": "23.12.2026"
  },
  {
    "title": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen",
    "description": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen - Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen",
    "startDate": "07.01.2027",
    "endDate": "27.01.2027"
  },
  {
    "title": "Zeitmanagement",
    "description": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen - Zeitmanagement",
    "startDate": "28.01.2027",
    "endDate": "29.01.2027"
  },
  {
    "title": "Berufsvorbereitende Maßnahmen",
    "description": "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen - Berufsvorbereitende Maßnahmen",
    "startDate": "01.02.2027",
    "endDate": "02.02.2027"
  }
]

async function main() {
  // Clean up
  await prisma.grade.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.bulletinPost.deleteMany()
  await prisma.courseEvent.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.teacherSkill.deleteMany()
  await prisma.user.deleteMany()

  // 1. Admin / IT
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Is TrAItor',
      email: 'admin@cc-corp.de',
      role: 'admin',
    },
  })

  // 2. Dozent
  const doc = await prisma.user.create({
    data: {
      name: 'Prof. Dr. Code',
      email: 'prof-code@cc-corp.de',
      role: 'staff',
    },
  })

  // 3. Student 1 (Der Klassiker)
  const max = await prisma.user.create({
    data: {
      name: 'Marc Mustermann',
      email: 'marc@cc-student.de',
      role: 'student',
    },
  })

  // Noten für Marc
  const gradesData = [
    { subject: 'Allgemeine Betriebswirtschaftslehre', value: 1.0 },
    { subject: 'Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil I', value: 1.0 },
    { subject: 'Netzwerk- und Kommunikationstechnik', value: 1.0 },
    { subject: 'Systemtechnik Teil I', value: 1.0 },
    { subject: 'Leistungserbringung /-bewertung, Kundenbeziehungsmanagement', value: 1.0 },
    { subject: 'Technisches Englisch', value: 1.0 },
    { subject: 'Prozedurale und Objektorientierte Programmierung', value: 1.0 },
    { subject: 'Datenbanken', value: 1.7 },
    { subject: 'Qualitätsmanagement, IT-Sicherheit und Datenschutz Teil II', value: 1.0 },
  ];

  for (const g of gradesData) {
    await prisma.grade.create({
      data: {
        userId: max.id,
        subject: g.subject,
        value: g.value
      }
    });
  }

  // 4. Student 2 (Engagiert)
  const anna = await prisma.user.create({
    data: {
      name: 'Felippa Fleißig',
      email: 'felippa@cc-student.de',
      role: 'student',
    },
  })

  // 5. Verwaltung / Sekretariat
  const office = await prisma.user.create({
    data: {
      name: 'Susi Sorglos',
      email: 'office@cc-corp.de',
      role: 'admin',
    },
  })

  console.log('Users created: Admin, Doc, Max, Anna, Susi')

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title: 'Willkommen im neuen Intranet 2.0!',
      content: 'Jetzt mit Login und echten Usern. Viel Spaß beim Testen.',
      author: 'Admin Adminowitsch',
    }
  })
  
  await prisma.announcement.create({
    data: {
      title: 'Kaffeemaschine defekt',
      content: 'Die Maschine im 2. Stock wird morgen repariert.',
      author: 'Susi Sorglos',
    }
  })

  // Create Courses
  for (const event of courseData) {
    await prisma.courseEvent.create({
      data: {
        title: event.title,
        description: event.description,
        startTime: parseDate(event.startDate, "08:00:00"),
        endTime: parseDate(event.endDate, "16:00:00"),
        location: 'Hybrid',
        instructor: 'Dozent',
      }
    })
  }

  // Create Bulletin Posts
  await prisma.bulletinPost.create({
    data: {
      title: 'Suche Lerngruppe für React',
      description: 'Wer hat Lust sich 2x die Woche zu treffen?',
      type: 'SEARCH',
      contactInfo: 'Slack: @max',
      userId: max.id
    }
  })
  
   await prisma.bulletinPost.create({
    data: {
      title: 'Nachhilfe Statistik',
      description: 'Ich biete Statistik-Nachhilfe für Erstis.',
      type: 'OFFER',
      contactInfo: 'anna@cc-student.de',
      userId: anna.id
    }
  })

  // Create Exams
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  await prisma.exam.create({
    data: {
      title: 'Web Development Abschlussprüfung',
      date: new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000), // In 1 week
      content: 'HTML, CSS, React, Next.js, Prisma',
      location: 'Hörsaal 1',
      duration: 90
    }
  })

  await prisma.exam.create({
    data: {
      title: 'Datenbanken I',
      date: new Date(tomorrow.getTime() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
      content: 'SQL, Normalisierung, ER-Diagramme',
      location: 'Raum 202',
      duration: 60
    }
  })

  await prisma.exam.create({
    data: {
      title: 'Statistik Klausur',
      date: new Date(tomorrow.getTime() + 20 * 24 * 60 * 60 * 1000), // In 3 weeks
      content: 'Wahrscheinlichkeitsrechnung, Verteilungen',
      location: 'Hörsaal 2',
      duration: 120
    }
  })

  console.log('Seeding finished.')
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
