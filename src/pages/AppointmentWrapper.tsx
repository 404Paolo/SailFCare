import Navbar from "../components/NavBar";
import AppointmentPage from "./AppointmentPage";

const AppointmentWrapper: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col bg-sail_gray">
      <Navbar/>
      <AppointmentPage/>
    </div>
  );
};

export default AppointmentWrapper;
