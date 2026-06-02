import React, { useState, useEffect, useRef } from 'react'
import { useNotifications } from '../hooks/useNotifications'

export const NotificationPanel: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { data: notifications = [], isLoading, markRead, remove } = useNotifications()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const onClickOutside = (e: MouseEvent) => {
      if (!open) return
      const target = e.target as Node
      if (panelRef.current && !panelRef.current.contains(target) && toggleRef.current && !toggleRef.current.contains(target)) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClickOutside)
    }
  }, [open])

  useEffect(() => {
    if (open && panelRef.current) {
      const firstBtn = panelRef.current.querySelector('button') as HTMLButtonElement | null
      if (firstBtn) firstBtn.focus()
    }
  }, [open])

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
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div ref={panelRef} className="notification-panel" role="dialog" aria-label="Notifications panel">
          <div className="notification-panel-header">
            <strong>Notifications</strong>
          </div>
          <div className="notification-list">
            {isLoading && <div className="notification-empty">Loading...</div>}
            {!isLoading && notifications.length === 0 && (
              <div className="notification-empty">No notifications</div>
            )}
            {!isLoading && notifications.map((n) => (
              <div key={n.id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
                <div className="notification-main">
                  <div className="notification-type">{n.type}</div>
                  <div className="notification-payload">{n.payload}</div>
                  <div className="notification-time">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="notification-actions">
                  {!n.isRead && (
                    <button onClick={() => markRead.mutate(n.id)}>Mark read</button>
                  )}
                  <button onClick={() => remove.mutate(n.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
