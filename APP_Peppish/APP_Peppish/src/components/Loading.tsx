import React from 'react'
import '../styling/skeleton.css'

export const Loading: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="loading-container">
      <div className="spinner" aria-hidden></div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  )
}

export default Loading
