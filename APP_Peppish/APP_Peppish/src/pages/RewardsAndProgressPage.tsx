// import { useUserBalance, useRewardHistory } from "../hooks/useRewards";
// import { useAvatarProgress, useDailyProgress } from "../hooks/useProgress";
// import logoImg from "../assets/logo_img.png";
import { RewardComponent } from "../components/RewardComponent";
import { ProgressComponent } from "../components/ProgressComponent";

export const RewardsAndProgressPage = () => {
  return (
    <>
      <ProgressComponent />
      <RewardComponent />
    </>
  );
  // const {
  //   data: balance,
  //   isLoading: balanceLoading,
  //   error: balanceError,
  // } = useUserBalance();
  // const {
  //   data: history = [],
  //   isLoading: historyLoading,
  //   error: historyError,
  // } = useRewardHistory(20);

  // const {
  //   data: avatar,
  //   isLoading: avatarLoading,
  //   error: avatarError,
  // } = useAvatarProgress();

  // const {
  //   data: dailyProgress,
  //   isLoading: dailyLoading,
  //   error: dailyError,
  // } = useDailyProgress();

  // const isLoading = balanceLoading || historyLoading || avatarLoading || dailyLoading;
  // const error = balanceError || historyError || avatarError || dailyError;

  // if (isLoading) return <div className="loading-container"><div className="spinner">Loading...</div></div>
  // if (error) return <div className="error-message alert alert-error">Failed to load data</div>

  // return (
  //   <div className="rewards-progress-container">
  //     <h1 className="logo-icon"><img src={logoImg} alt="App logo"/> Belöningar & Framsteg</h1>

  //     {balance && (
  //       <div className="balance-section">
  //         <div className="balance-cards">
  //           <div className="balance-card money">
  //             <div className="balance-label">Intjänat: </div>
  //             <div className="balance-value">🤑 </div>
  //             <div className="balance-value">{balance.totalMoney.toFixed(2)}</div>
  //           </div>
  //           <div className="balance-card progress">
  //             <div className="balance-label">Dina XP: </div>
  //             <div className="balance-value">💎 </div>
  //             <div className="balance-value">{balance.totalProgress} </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {avatar && (
  //       <div className="avatar-section">
  //         <h2>Avatar Level</h2>
  //         <div className="avatar-card">
  //           <div className="avatar-display">
  //             <div className="avatar-placeholder">{avatar.avatarUrl ? '🎮' : '🧑'}</div>
  //             <div className="level-badge">Level {avatar.level}</div>
  //           </div>

  //           <div className="experience-section">
  //             <div className="experience-label">Experience Progress</div>
  //             <div className="progress-bar-container">
  //               <div className="progress-bar-fill" style={{ width: `${(avatar.experience / avatar.maxExperience) * 100}%` }} />
  //             </div>
  //             <div className="experience-text">{avatar.experience} / {avatar.maxExperience} XP</div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {dailyProgress && (
  //       <div className="daily-section">
  //         <h2>Today's Progress</h2>
  //         <div className="daily-card">
  //           <div className="progress-stat">
  //             <div className="stat-label">Chores Completed</div>
  //             <div className="stat-value">{dailyProgress.completedChores}</div>
  //           </div>

  //           <div className="progress-stat">
  //             <div className="stat-label">Chores Approved</div>
  //             <div className="stat-value">{dailyProgress.approvedChores}</div>
  //           </div>

  //           <div className="progress-stat">
  //             <div className="stat-label">Total Chores</div>
  //             <div className="stat-value">{dailyProgress.totalChores}</div>
  //           </div>

  //           <div className="daily-progress-wrapper">
  //             <div className="progress-label">Daily Completion Rate</div>
  //             <div className="progress-bar-container">
  //               <div className="progress-bar-fill daily" style={{ width: `${dailyProgress.totalChores > 0 ? (dailyProgress.completedChores / dailyProgress.totalChores) * 100 : 0}%` }} />
  //             </div>
  //             <div className="progress-percentage">{dailyProgress.totalChores > 0 ? Math.round((dailyProgress.completedChores / dailyProgress.totalChores) * 100) : 0}%</div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <div className="history-section">
  //       <h2>Tidigare belöningar och XP:</h2>
  //       {history.length === 0 ? (
  //         <p className="no-rewards">Du har tyvärr inte fått några belöningar ännu.. Genomför en quest för att få XP eller pengar.</p>
  //       ) : (
  //         <div className="rewards-list">
  //           {history.map((reward) => (
  //             <div key={reward.id} className={`reward-item reward-${reward.type}`}>
  //               <div className="reward-icon">{reward.type === 'money' ? '🤑' : '💎'}</div>
  //               <div className="reward-details">
  //                 <div className="reward-value">{reward.value}</div>
  //                 <div className="reward-date">{new Date(reward.createdAt).toLocaleDateString()}</div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )
};
