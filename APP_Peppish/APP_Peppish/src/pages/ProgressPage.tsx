import { useAvatarProgress, useDailyProgress } from '../hooks/useProgress'
import logoImg from '../assets/logo_img.png'

export const ProgressPage = () => {
  const {
    data: avatar,
    isLoading: avatarLoading,
    error: avatarError,
  } = useAvatarProgress()
  const {
    data: dailyProgress,
    isLoading: dailyLoading,
    error: dailyError,
  } = useDailyProgress()

  const isLoading = avatarLoading || dailyLoading
  const error = avatarError || dailyError

  if (isLoading) {
    return <div className="loading-container"><div className="spinner">Loading progress...</div></div>
  }

  if (error) {
    return <div className="error-message alert alert-error">Failed to load progress</div>
  }

  return (
    <div className="progress-container">
       <h1 className="logo-icon" >
        <img src={logoImg} alt="App logo" /> nåt svenkst namn på detta:Your Progress</h1>

      {avatar && (
        <div className="avatar-section">
          <h2>Avatar Level</h2>
          <div className="avatar-card">
            <div className="avatar-display">
              <div className="avatar-placeholder">{avatar.avatarUrl ? '🎮' : '🧑'}</div>
              <div className="level-badge">Level {avatar.level}</div>
            </div>

            <div className="experience-section">
              <div className="experience-label">Experience Progress</div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(avatar.experience / avatar.maxExperience) * 100}%`,
                  }}
                />
              </div>
              <div className="experience-text">
                {avatar.experience} / {avatar.maxExperience} XP
              </div>
            </div>
          </div>
        </div>
      )}

      {dailyProgress && (
        <div className="daily-section">
          <h2>Today's Progress</h2>
          <div className="daily-card">
            <div className="progress-stat">
              <div className="stat-label">Chores Completed</div>
              <div className="stat-value">{dailyProgress.completedChores}</div>
            </div>

            <div className="progress-stat">
              <div className="stat-label">Chores Approved</div>
              <div className="stat-value">{dailyProgress.approvedChores}</div>
            </div>

            <div className="progress-stat">
              <div className="stat-label">Total Chores</div>
              <div className="stat-value">{dailyProgress.totalChores}</div>
            </div>

            <div className="daily-progress-wrapper">
              <div className="progress-label">Daily Completion Rate</div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill daily"
                  style={{
                    width: `${
                      dailyProgress.totalChores > 0
                        ? (dailyProgress.completedChores / dailyProgress.totalChores) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="progress-percentage">
                {dailyProgress.totalChores > 0
                  ? Math.round(
                      (dailyProgress.completedChores / dailyProgress.totalChores) * 100
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
