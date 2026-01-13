import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotifications, markNotificationAsRead } from "@/lib/actions";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export async function NotificationsSidebar() {
    const user = await getCurrentUser();
    if (!user) return null;

    const notifications = await getUnreadNotifications();

    return (
         <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                            {notifications.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Benachrichtigungen</h4>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {notifications.length > 0 ? (
                            notifications.map((note) => (
                                <div key={note.id} className="w-full p-2 text-sm hover:bg-slate-50 rounded border-b last:border-0 group flex flex-col gap-1">
                                    {note.link ? (
                                        <a href={note.link} className="font-medium text-gray-800 hover:text-blue-600 hover:underline block">
                                            {note.message}
                                        </a>
                                    ) : (
                                        <p className="font-medium text-gray-800">{note.message}</p>
                                    )}
                                    
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] text-gray-400">{note.createdAt.toLocaleDateString()}</span>
                                        <form action={async () => {
                                            "use server";
                                            await markNotificationAsRead(note.id);
                                        }}>
                                            <button type="submit" className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                                                Als gelesen markieren
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">Keine neuen Nachrichten.</p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
