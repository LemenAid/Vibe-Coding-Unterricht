import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, BookOpen, UserCircle, Settings, Shield, Clock, GraduationCap, LayoutDashboard, Database, HelpCircle } from "lucide-react";

export default async function TutorialPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Define content for each role
  const roleContent = {
    admin: {
      title: "Administratoren-Guide",
      description: "Volle Kontrolle über das System, Benutzerverwaltung und Konfiguration.",
      icon: Shield,
      sections: [
        {
          title: "Benutzerverwaltung",
          content: "Erstellen, bearbeiten und löschen Sie Benutzerkonten. Verwalten Sie Rollen und Berechtigungen.",
          icon: UserCircle,
          steps: [
            "Gehen Sie im Menü zu 'Admin'", 
            "Nutzen Sie 'Add User' oben rechts", 
            "Füllen Sie Name, E-Mail und Rolle aus",
            "Passwörter können bei Bedarf zurückgesetzt werden"
          ]
        },
        {
          title: "Skill Freigaben",
          content: "Überprüfen und genehmigen Sie Skills, die von Benutzern eingereicht wurden.",
          icon: CheckCircle2,
          steps: [
            "Navigieren Sie zu 'Skill Freigaben'", 
            "Sehen Sie offene Skill-Anfragen", 
            "Genehmigen oder lehnen Sie Skills ab"
          ]
        },
        {
          title: "System & Datenbank",
          content: "Direkter Zugriff auf die Datenbank und Systemüberwachung.",
          icon: Database,
          steps: [
            "Nutzen Sie den 'Prisma DB' Link in der Sidebar", 
            "Verwalten Sie Datensätze direkt (Vorsicht geboten!)",
            "Überwachen Sie System-Logs"
          ]
        }
      ]
    },
    staff: {
      title: "Verwaltungs-Handbuch",
      description: "Organisation von Education Tracks, Kursen und Schülern.",
      icon: Settings,
      sections: [
        {
          title: "Education Tracks",
          content: "Legen Sie neue Ausbildungsgänge und Jahrgänge an.",
          icon: GraduationCap,
          steps: [
            "Öffnen Sie den Bereich 'Planung'", 
            "Erstellen Sie einen neuen Track (z.B. 'FIAE 2024')", 
            "Definieren Sie Start- und Enddatum"
          ]
        },
        {
          title: "Kursverwaltung",
          content: "Erstellen Sie Kurse und weisen Sie diese den Tracks zu.",
          icon: BookOpen,
          steps: [
            "Erstellen Sie Kurse innerhalb eines Tracks", 
            "Weisen Sie Dozenten und Räume zu", 
            "Verwalten Sie Modulinhalte"
          ]
        },
        {
          title: "Schüler anlegen",
          content: "Fügen Sie neue Schüler manuell zum System hinzu.",
          icon: UserCircle,
          steps: [
            "Nutzen Sie die Benutzerverwaltung (Admin-Bereich)", 
            "Erstellen Sie Accounts mit Rolle 'Student'", 
            "Weisen Sie den Schüler einem Education Track zu"
          ]
        }
      ]
    },
    teacher: {
      title: "Dozenten-Leitfaden",
      description: "Kursmanagement, Notengebung und Prüfungsverwaltung.",
      icon: BookOpen,
      sections: [
        {
          title: "Meine Kurse",
          content: "Übersicht über Ihre aktuellen und vergangenen Kurse.",
          icon: LayoutDashboard,
          steps: [
            "Klicken Sie auf 'Meine Kurse'", 
            "Sehen Sie Details zu Ihren zugewiesenen Modulen", 
            "Prüfen Sie die Teilnehmerliste"
          ]
        },
        {
          title: "Prüfungsverwaltung",
          content: "Erstellen und verwalten Sie Prüfungen für Ihre Kurse.",
          icon: CheckCircle2,
          steps: [
            "Gehen Sie zu 'Prüfungsverwaltung'", 
            "Erstellen Sie eine neue Prüfung", 
            "Definieren Sie Datum und Uhrzeit"
          ]
        },
        {
          title: "Noten eintragen",
          content: "Bewerten Sie Schülerleistungen und geben Sie Feedback.",
          icon: BookOpen,
          steps: [
            "Wählen Sie eine Prüfung aus", 
            "Tragen Sie Noten für jeden Schüler ein", 
            "Speichern Sie die Bewertungen"
          ]
        }
      ]
    },
    student: {
      title: "Schüler-Tutorial",
      description: "Ihr Begleiter für den täglichen Unterrichtsablauf.",
      icon: GraduationCap,
      sections: [
        {
          title: "Zeiterfassung",
          content: "Erfassen Sie Ihre Arbeitszeiten präzise.",
          icon: Clock,
          steps: [
            "Klicken Sie auf 'Zeiterfassung' in der Sidebar", 
            "Nutzen Sie den grünen 'Clock In' Button beim Start", 
            "Wählen Sie 'Remote' oder 'On Site'", 
            "Beenden Sie den Tag mit 'Clock Out'"
          ]
        },
        {
          title: "Dashboard & Kurse",
          content: "Ihr Überblick über aktuelle Module und Termine.",
          icon: LayoutDashboard,
          steps: [
            "Das Dashboard zeigt aktuelle Informationen", 
            "Unter 'Kursplan' finden Sie Ihre Termine", 
            "Beachten Sie Ankündigungen auf dem Schwarzen Brett"
          ]
        },
        {
          title: "Support Anfrage",
          content: "Stellen Sie Fragen an Dozenten oder die Verwaltung.",
          icon: HelpCircle,
          steps: [
            "Klicken Sie auf 'Neue Anfrage' in der Sidebar", 
            "Wählen Sie den Empfänger (Lehrer/Admin)", 
            "Beschreiben Sie Ihr Anliegen und senden es ab"
          ]
        }
      ]
    }
  };

  // Fallback for unknown roles or if role is missing in map
  // @ts-expect-error - roleContent index signature is implicit
  const currentRoleContent = roleContent[user.role] || roleContent.student;
  const RoleIcon = currentRoleContent.icon;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <RoleIcon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentRoleContent.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{currentRoleContent.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* @ts-expect-error - sections might be missing on some types */}
        {currentRoleContent.sections.map((section, index) => {
          const SectionIcon = section.icon || BookOpen;
          return (
            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <SectionIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {section.content}
                </p>
                <div className="mt-auto bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Wie geht das?</p>
                  <ul className="space-y-2">
                    {/* @ts-expect-error - steps might be missing on some types */}
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm flex items-start gap-2">
                        <span className="min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-[10px] font-bold text-blue-600 dark:text-blue-300 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 leading-tight py-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
        <CardContent className="flex items-center gap-4 p-6">
          <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Benötigen Sie weitere Hilfe?</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Für technische Fragen wenden Sie sich bitte an die Administration oder nutzen Sie die integrierte Support-Funktion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
