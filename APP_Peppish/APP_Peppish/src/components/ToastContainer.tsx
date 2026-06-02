import React from 'react'
import { useToast } from '../context/ToastContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="status">
          <div className="toast-message">{t.message}</div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
