import { useNavigate } from 'react-router'
import { useAvatarProgress, useDailyProgress } from '../hooks/useProgress'
import logoImg from '../assets/logo_img.png'
import { XPBottle } from '../components/XPBottle'

export const ProgressPage = () => {
  const navigate = useNavigate()

  const {
  data: dailyProgress,
  isLoading: dailyLoading,
  error: dailyError,
} = useDailyProgress()

  
  const {
    data: avatar,
    isLoading: avatarLoading,
    error: avatarError,
  } = useAvatarProgress()

  const progress = dailyProgress?.totalChores
    ? (dailyProgress.completedChores / dailyProgress.totalChores) * 100
    : 0;



  const isLoading = avatarLoading || dailyLoading
  const error = avatarError || dailyError

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">Laddar framsteg...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message alert alert-error">
        Kunde inte ladda framsteg
      </div>
    )
  }

 

  return (
    <div className="progress-container">

      <h1 className="logo-icon">
        <img src={logoImg} alt="App logo" />
        Peppstatus
      </h1>

      {avatar && (
        <div className="avatar-section">
          <div
            className="avatar-card clickable"
            onClick={() => navigate('/avatar')}
          >
            <div className="avatar-display">

              <div className="avatar-image">
                {avatar.avatarUrl ? (
                  <img src={avatar.avatarUrl} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">🧑</div>
                )}
              </div>

              <div className="level-badge">
                Level {avatar.level}
              </div>

            </div>

            <p className="avatar-text">
              Klicka för att ändra avatar
            </p>
          </div>
        </div>
      )}

<div className="piggybank-card">

            <div className="piggybank-icon">
              🐷
            </div>
            <div>
              <div className="piggybank-label">
                Spargris
              </div>

              <div className="piggybank-money">
                245 kr
              </div>
            </div>
            
        </div>
      {dailyProgress && (
        <div className="daily-section">
          <div className="daily-card">
          <h2>Dagens framsteg</h2>
            <div className="xp-bottle-wrapper">

                <XPBottle progress={progress} />
             
            </div>

            <div className="daily-stats">

              <div className="progress-stat">
                <div className="stat-label">
                  Klarade chores
                </div>

                <div className="stat-value">
                  {dailyProgress.completedChores}
                </div>
              </div>

              <div className="progress-stat">
                <div className="stat-label">
                  Godkända chores
                </div>

                <div className="stat-value">
                  {dailyProgress.approvedChores}
                </div>
              </div>

              <div className="progress-stat">
                <div className="stat-label">
                  Totalt idag
                </div>

                <div className="stat-value">
                  {dailyProgress.totalChores}
          </div>
                </div>
              </div>

            </div>
          </div>       
      )}
    </div>
  )
}