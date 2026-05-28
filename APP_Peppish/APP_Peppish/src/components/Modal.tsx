import React from 'react'

const baseBackdrop: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
}

const baseContent: React.CSSProperties = {
  background: '#fff',
  padding: '1rem',
  borderRadius: 8,
  maxWidth: '95%',
  width: 540,
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
}

export const Modal = ({
  children,
  onClose,
  full = false,
}: {
  children: React.ReactNode
  onClose: () => void
  full?: boolean
}) => {
  const backdropStyle: React.CSSProperties = {
    ...baseBackdrop,
    background: full ? 'transparent' : 'rgba(0,0,0,0.5)'
  }

  const contentStyle: React.CSSProperties = full
    ? {
        ...baseContent,
        background: 'transparent',
        padding: 0,
        borderRadius: 0,
        width: '90%',
        maxWidth: '900px',
        boxShadow: 'none',
      }
    : baseContent

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }} onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  )
}

export default Modal
