import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import profilePic from "../assets/profilepic.png"
import useUserRole from "../hooks/useUserRole";
import Dashboard from "../components/homeadmin/Dashboard";
import Dashboard2 from "../components/homeadmin/Dashboard2";
import Appointment from "../components/homeadmin/AppointmentFrag2";
import Inventory from "../components/homeadmin/Inventory";
import Profile from "../components/homeadmin/Profile";
import UsersFrag from "../components/homeadmin/Users";
import Patients from "../components/homeadmin/Patients";
import HealthRecords from "../components/homeadmin/HealthRecords";
import HealthRecords2 from "../components/homeadmin/HealthRecords2";
import sailLogo from "../assets/saillogo.png";
import Appointment2 from "./AppointmentPage";
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  HeartHandshake,
  FolderHeart,
  CalendarHeart,
  Menu,
  User,
  TriangleAlert,
  X
} from "lucide-react";
import RiskAssessmentForm from "./RiskAssessmentForm";
import RiskAssessmentWrapper from "./RiskAssessmentWrapper";

const navItems = [
  { name: "Dashboard", icon: Home, component: Dashboard },
  { name: "Appointment", icon: CalendarHeart, component: Appointment },
  { name: "Patients", icon: HeartHandshake, component: Patients },
  { name: "Health Records", icon: FolderHeart, component: HealthRecords },
  { name: "Inventory", icon: ClipboardList, component: Inventory },
  { name: "Users", icon: Users, component: UsersFrag },
  { name: "Profile", icon: User, component: Profile },
  { name: "Risk Assessment", icon: TriangleAlert, component: RiskAssessmentWrapper}
];

export default function HomePage() {
  const { role, firstName, loading } = useUserRole();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  if (loading) return <div className="p-6">Loading...</div>;
  if (!role) return <div className="p-6">User role not found.</div>;

  // Filter and transform nav items based on role
  const filteredNavItems = role === "admin"
    ? navItems
    : navItems
        .filter(item =>
          ["Dashboard", "Appointment", "Health Records", "Risk Assessment", "Profile"].includes(item.name)
        )
        .map(item => {
          if (item.name === "Dashboard") {
            return { ...item, component: Dashboard2 };
          } else if (item.name === "Health Records") {
            return { ...item, component: HealthRecords2 };
          }  else if (item.name === "Appointment") {
            return { ...item, component: Appointment2 };
          }
          return item;
        });

  const ActiveComponent = filteredNavItems.find(item => item.name === activeTab)?.component || (() => <div>Select a tab</div>);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F3]">
      <div className={`m-5 rounded-xl shadow-[0_0_32px_2px_rgba(0,0,0,0.15)] ${collapsed ? "w-20" : "w-64"} transition-all duration-300 bg-white border-r shadow-sm p-4 flex flex-col justify-between`}>
        <div>
          <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}>
            <img src={sailLogo} alt="SAIL logo" className={`h-10 transition-all duration-300 ${collapsed ? "hidden" : "ml-2"}`} />
            <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-gray-100">
              {collapsed ? <Menu /> : <X />}
            </button>
          </div>

          <nav className="space-y-2">
            {filteredNavItems.map(({ name, icon: Icon }) => (
              <div
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-red-400 hover:text-white hover:bg-gray-100 duration-200 ${
                  activeTab === name ? "bg-sail_red text-white font-semibold" : ""
                } ${collapsed && "justify-center"}`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{name}</span>}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-sail_red hover:text-white duration-200"
            onClick={() => setActiveTab("Profile")}>
            <img src={profilePic} alt="Admin" className="rounded-full w-8 h-8" />
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">{firstName}</p>
                <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full capitalize">
                  {role}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <button className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-red-500" />
              {!collapsed && <span className="text-sm text-red-500">Log out</span>}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        <ActiveComponent />
      </main>
    </div>
  );
}
