import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  fetchNotifications,
  markAllRead,
  markOneRead,
} from "@/services/notificationService";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const notificationMessage = (type, actorName) => {
  switch (type) {
    case "new_follower": return `${actorName} started following you`;
    case "new_comment": return `${actorName} commented on your blog`;
    case "comment_reply": return `${actorName} replied to your comment`;
    case "new_upvote": return `${actorName} upvoted your blog`;
    default: return `${actorName} interacted with you`;
  }
};

const getNotificationLink = (notification) => {
  const { type, blog_id, actor } = notification;
  if (type === "new_follower") return `/users/${actor?.id}`;
  if (blog_id) return `/blogs/${blog_id}`;
  return null;
};

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    markAllReadLocally,
    markOneReadLocally,
  } = useNotificationStore();

  useEffect(() => {
    if (!user || !profile?.id) return;

    fetchNotifications()
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.error("Failed to fetch notifications:", err));

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => addNotification(payload.new),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, profile?.id]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      markAllReadLocally();
    } catch {}
  };

  const handleNotificationClick = async (notification) => {
    setOpen(false);

    if (!notification.is_read) {
      markOneReadLocally(notification.id);
      markOneRead(notification.id).catch(() => {});
    }

    const link = getNotificationLink(notification);
    if (link) navigate(link);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative hidden md:flex items-center gap-2 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 dark:bg-gray-900 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3 border-b dark:border-gray-800 last:border-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !n.is_read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
              >
                {n.actor?.avatar ? (
                  <img
                    src={n.actor.avatar}
                    alt={n.actor.name}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">
                    {notificationMessage(n.type, n.actor?.name || "Someone")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!n.is_read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
