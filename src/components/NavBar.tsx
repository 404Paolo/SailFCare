import { Link } from 'react-router-dom';
import logoSail from "../assets/saillogo.png";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleScrollLink = (sectionId: string) => {
    const isLandingPage = window.location.pathname === "/";
    if (isLandingPage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/?scrollTo=${sectionId}`);
    }
  };

  return (
    <nav className="bg-white shadow-lg py-6 px-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logoSail} alt="SAIL Logo" className="h-14 w-auto pl-2 hover:scale-105 duration-100" />
        </Link>
      </div>
      <div className="space-x-10 text-sm font-medium">
        <button onClick={() => handleScrollLink("about")} className="text-gray-700 hover:text-red-600">About Us</button>
        <button onClick={() => handleScrollLink("services")} className="text-gray-700 hover:text-red-600">Our Services</button>
        <button onClick={() => handleScrollLink("contact")} className="text-gray-700 hover:text-red-600">Contact Us</button>
        <Link to="/login">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 duration-300">Log In</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;