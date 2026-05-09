type BottleProps = {
  progress: number
}

export const XPBottle = ({ progress }: BottleProps) => {
  const clamped = Math.max(0, Math.min(100, progress))

  return (
    <>
      <div className="xp-bottle">
        <div
          className="xp-liquid"
          style={{
            height: `${clamped}%`,
          }}
        />
      </div>

      <div className="xp-percentage">{Math.round(clamped)}%</div>
    </>
  )
}