import { Link } from "react-router-dom";

import logoSailWhite from "../assets/saillogowhite.png";
import iconFacebook from "../assets/facebook-app-symbol (2).png";
import iconTwitter from "../assets/twitter (2).png";
import iconInstagram from "../assets/instagram (3).png";
import iconPhone from "../assets/phone.png";
import iconEmail from "../assets/email.png";
import iconMap from "../assets/map.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-red-500 text-white px-12 py-10">
      <div>
        <div className="flex justify-between">
          <div className="max-w-[30%]">
            <img src={logoSailWhite} alt="SAIL Footer Logo" className="h-10 mb-4" />
            <p className="text-sm">Affordable, high-quality services for HIV prevention and primary care treatment in Makati, NCR.</p>
            <Link to="/appointment">
              <button className="my-8 bg-white text-sm text-red-600 px-4 py-2 font-semibold rounded hover:bg-red-600 hover:text-white duration-300">
                Book Appointment
              </button>
            </Link>
          </div>
          <div className="max-w-[20%] flex flex-col justify-evenly">
            <p className="flex items-center mb-2 text-sm">
              <img src={iconEmail} alt="Email" className="w-5 mr-2" /> sailmakati@ship.ph
            </p>
            <p className="flex items-center mb-2 text-sm">
              <img src={iconPhone} alt="Phone" className="w-5 mr-2" /> (+63) 997 152 2493
            </p>
            <a href="https://maps.app.goo.gl/z9DGG3vdfnWezucd6" className="flex items-center text-sm hover:underline">
              <img src={iconMap} alt="Location" className="w-5 mr-2" /> 2nd Floor Unit 2B, 9651 Kamagong Building, Makati City
            </a>
          </div>
        </div>
      </div>
      <div className="border-white border-t py-4">
        <div className="flex justify-between">
          <p className="text-xs">Copyright © 2025 SAIL Clinic. All rights reserved.</p>
          <div className="text-sm text-right self-end">
            <div className="flex justify-end space-x-4">
              <a href="https://www.facebook.com/SailClinicMakati/#">
                <img src={iconFacebook} alt="facebook" className="h-4 w-auto" />
              </a>
              <a href="https://x.com/sailclinics?lang=en">
                <img src={iconTwitter} alt="twitter" className="h-4 w-auto" />
              </a>
              <a href="https://www.instagram.com/sailclinics/?hl=en">
                <img src={iconInstagram} alt="instagram" className="h-4 w-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
