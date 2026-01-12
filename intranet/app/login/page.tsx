import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { loginAction } from "@/lib/auth-actions";
import { User, Shield, School, GraduationCap, FileText } from "lucide-react";

export default async function LoginPage() {
  const users = await prisma.user.findMany({
    orderBy: { role: 'asc' } // Admin zuerst
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">CC Vibe Portal Login</h1>
          <p className="mt-2 text-lg text-gray-600">Wähle einen Benutzer für die Demo-Session</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <form key={user.id} action={loginAction.bind(null, user.id)}>
              <button className="w-full text-left transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl">
                <Card className="h-full border-2 hover:border-blue-500 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      {user.role}
                    </CardTitle>
                    {user.role === 'admin' && <Shield className="h-4 w-4 text-red-500" />}
                    {user.role === 'staff' && <School className="h-4 w-4 text-purple-500" />}
                    {user.role === 'student' && <GraduationCap className="h-4 w-4 text-blue-500" />}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 pt-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                            ${user.role === 'admin' ? 'bg-red-500' : 
                              user.role === 'staff' ? 'bg-purple-500' : 'bg-blue-500'
                            }`}
                        >
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
