import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotifications, getReadNotifications } from "@/lib/actions";
import { NotificationsSidebarClient } from "./notifications-sidebar";

export async function NotificationsSidebar() {
    const user = await getCurrentUser();
    if (!user) return null;

    const unreadNotifications = await getUnreadNotifications();
    const readNotifications = await getReadNotifications();

    return (
        <NotificationsSidebarClient 
            unreadNotifications={unreadNotifications}
            readNotifications={readNotifications}
        />
    );
}
