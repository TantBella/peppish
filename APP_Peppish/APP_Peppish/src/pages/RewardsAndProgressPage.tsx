import { RewardComponent } from "../components/RewardComponent";
import { ProgressComponent } from "../components/ProgressComponent";
import { NotificationPanel } from "../components/NotificationPanel";
import logoImg from "../assets/logo_img.png";

export const RewardsAndProgressPage = () => {
  return (
    <>
      <header className="header">
        <h1 className="logo-icon">
          <img src={logoImg} alt="App logo" />
          Belöningar & Framsteg
        </h1>
        <div style={{ position: "absolute", right: 16, top: 16 }}>
          <NotificationPanel />
        </div>
      </header>
      <ProgressComponent />
      <RewardComponent />
    </>
  );
};
