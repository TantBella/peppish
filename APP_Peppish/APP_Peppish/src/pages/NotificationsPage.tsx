import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";
import Loading from "../components/Loading";

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const n = await notificationService.getNotifications(user.id);
      if (mounted) {
        setItems(n);
        setLoading(false);
      }
    };

    load();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "peppish_notifications" || e.key === null) {
        load();
      }
    };
    window.addEventListener("storage", onStorage);

    const interval = setInterval(() => {
      load();
    }, 5000);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [user]);

  const markRead = async (id: string) => {
    await notificationService.markRead(id);
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, read: true } : p)),
    );
  };

  if (!user) return <div>Please login</div>;
  if (loading) return <Loading message="Laddar..." />;

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      {items.length === 0 ? (
        <div>No notifications</div>
      ) : (
        <ul className="notification-list">
          {items.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? "read" : ""}`}
            >
              <div className="message">{n.message}</div>
              <div className="meta">
                {new Date(n.createdAt).toLocaleString()}
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)}>Mark read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
