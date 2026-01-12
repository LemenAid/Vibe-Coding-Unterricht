import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  MessageSquare, 
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r bg-gray-50/40 p-4 dark:bg-gray-800/40">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">CC</span>
          </div>
          <span className="text-xl font-bold">CC Portal</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard size={20} />
              Dashboard
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CalendarDays size={20} />
              Kursplan
            </Button>
          </Link>
          <Link href="/time">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Clock size={20} />
              Zeiterfassung
            </Button>
          </Link>
          <Link href="/bulletin">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <MessageSquare size={20} />
              Schwarzes Brett
            </Button>
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border bg-white p-3 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">Max Mustermann</span>
                <span className="text-xs text-gray-500">Student</span>
            </div>
        </div>
        <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut size={16} />
          Abmelden
        </Button>
      </div>
    </div>
  );
}
