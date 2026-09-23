import React, { useState, useEffect, useRef } from "react";
import { useNotifications } from "../hooks/useNotifications";
import check_icon from "../assets/icons/check_icon.png";

export const NotificationPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: notifications = [], isLoading, remove } = useNotifications();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onClickOutside = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) {
      const firstBtn = panelRef.current.querySelector(
        "button",
      ) as HTMLButtonElement | null;
      if (firstBtn) firstBtn.focus();
    }
  }, [open]);

  return (
    <div className="notification-container">
      <button
        ref={toggleRef}
        className="notification-icon"
        onClick={() => setOpen((s) => !s)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span aria-hidden>🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="notification-panel"
          role="dialog"
          aria-label="Notifications panel"
        >
          <div className="notification-panel-header">
            <strong>Notiser</strong>
          </div>
          <div className="notification-list">
            {isLoading && <div className="notification-empty">Laddar...</div>}
            {!isLoading && notifications.length === 0 && (
              <div className="notification-empty">Inga notiser just nu</div>
            )}
            {!isLoading &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.isRead ? "read" : "unread"}`}
                >
                  <div className="notification-main">
                    <div className="notification-type">
                      <div className="notification-type">
                        {n.type === "HOUSEHOLD_JOIN_REJECTED"
                          ? "Din förfrågan om att gå med i hushållet har nekats"
                          : n.type === "HOUSEHOLD_JOIN_APPROVED"
                            ? "Din förfrågan om att gå med i hushållet har godkänts"
                            : n.type === "HOUSEHOLD_JOIN_REQUEST"
                              ? "Ny förfrågan"
                              : n.type === "chore_needs_approval"
                                ? "Quest väntar på godkännande"
                                : n.type === "chore_completed"
                                  ? "Quest slutförd"
                                  : n.type === "chore_approved"
                                    ? "Quest godkänd"
                                    : n.type === "chore_assigned"
                                      ? "Ny quest"
                                      : n.type}
                      </div>
                    </div>
                    <div className="notification-payload">{n.payload}</div>
                    <div className="notification-time">
                      {new Date(n.createdAt).toLocaleDateString("sv-SE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="notification-actions">
                      <button onClick={() => remove.mutate(n.id)}>
                        <img src={check_icon} alt="Delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
