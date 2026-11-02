import { RewardComponent } from "../components/RewardComponent";
import { ProgressComponent } from "../components/ProgressComponent";
import HeaderComponent from "../components/HeaderComponent";

export const RewardsAndProgressPage = () => {
  return (
    <>
      <HeaderComponent title="Belöningar & Framsteg" />
      <ProgressComponent />
      <RewardComponent />
    </>
  );
};
