import { useNavigate } from "react-router-dom";
import home from "../assets/icons/home.png";
import calender from "../assets/icons/calender.png";
import rewards from "../assets/icons/rewards.png";
// import progress from "../assets/icons/progress.png";
import household_icon from "../assets/icons/household_icon.png";

import task from "../assets/icons/task.png";
import log_out from "../assets/icons/log_out.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="main-nav">
      <button onClick={() => navigate("/")} className="nav-button">
        <img src={home} alt="Home" className="Peppish-logo" />
      </button>
      <button onClick={() => navigate("/calendar")} className="nav-button">
        <img src={calender} alt="Calendar" className="Peppish-logo" />
      </button>
      <button onClick={() => navigate("/rewards")} className="nav-button">
        <img src={rewards} alt="Rewards" className="Peppish-logo" />
      </button>
      {/* <button onClick={() => navigate("/progress")} className="nav-button">
        <img src={progress} alt="App logo" className="Peppish-logo" />
      </button> */}
      <button onClick={() => navigate("/chores")} className="nav-button">
        <img src={task} alt="Chores" className="Peppish-logo" />
      </button>
      {user?.role === "ADULT" && (
        <button
          onClick={() =>
            navigate(user.householdId ? "/households" : "/no-household")
          }
          className="nav-button"
        >
          <img src={household_icon} alt="Household" className="Peppish-logo" />
        </button>
      )}
      <button onClick={handleLogout} className="nav-button">
        <img src={log_out} alt="App logo" className="Peppish-logo" />
      </button>
    </nav>
  );
};

export default Navbar;
