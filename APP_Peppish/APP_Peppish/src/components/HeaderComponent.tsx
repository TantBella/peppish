import logoImg from "../assets/logo_img.png";
import { NotificationPanel } from "../components/NotificationPanel";

interface HeaderComponentProps {
  title: string;
}

const HeaderComponent = ({ title }: HeaderComponentProps) => {
  return (
    <header className="header">
      <h1 className="logo-icon">
        <img src={logoImg} alt="App logo" />
        {title}
      </h1>

      <div style={{ position: "absolute", right: 16, top: 16 }}>
        <NotificationPanel />
      </div>
    </header>
  );
};

export default HeaderComponent;
