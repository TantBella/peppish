import React from 'react'
import '../styling/skeleton.css'

export const ChoreSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`chore-skeleton ${compact ? 'compact' : ''}`}>
      <div className="skeleton-line title" />
      <div className="skeleton-line meta" />
      <div className="skeleton-line actions" />
    </div>
  )
}

export default ChoreSkeleton
