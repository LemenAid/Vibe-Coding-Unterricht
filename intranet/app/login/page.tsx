import { prisma } from "@/lib/prisma";
import { LoginGrid } from "./login-grid";
import { ModeToggle } from "@/components/mode-toggle";

export default async function LoginPage() {
    const users = await prisma.user.findMany({
        orderBy: { role: 'asc' } 
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="max-w-7xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 drop-shadow-sm">VIBE Portal</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Wähle deinen Zugangsbereich für die Demo-Session</p>
        </div>

        <LoginGrid users={users} />
      </div>
    </div>
  );
}
