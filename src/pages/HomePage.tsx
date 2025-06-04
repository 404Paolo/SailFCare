import { useState } from "react";
// import Dashboard2 from "@/components/homeadmin/Dashboard2";
import Appointment from "../components/homeadmin/AppointmentFrag2";
import Inventory from "../components/homeadmin/Inventory";
import Profile from "@/components/homeadmin/Profile";
import UsersFrag from "@/components/homeadmin/Users";
// import HealthRecords2 from "@/components/homeadmin/HealthRecords2";
import Patients from "../components/homeadmin/Patients";
import sailLogo from "../assets/saillogo.png";
import Dashboard from "../components/homeadmin/Dashboard";
import HealthRecords from "@/components/homeadmin/HealthRecords";
// import Schedule from "../components/homeadmin/Schedule";
// import Reports from "../components/homeadmin/Reports";
// import Accounts from "../components/homeadmin/Accounts";
// import RiskAnalysis from "@/components/homeadmin/RiskAnalysis";
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
  // FileText,
  // Shield,
  // TriangleAlert,
  // Calendar,
  X
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: Home, component: Dashboard },
  { name: "Appointment", icon: CalendarHeart, component: Appointment },
  { name: "Patients", icon: HeartHandshake, component: Patients},
  { name: "Health Records", icon: FolderHeart, component: HealthRecords },
  // { name: "Schedule", icon: Calendar, component: Schedule },
  { name: "Inventory", icon: ClipboardList, component: Inventory },
  // { name: "Risk Analysis", icon: TriangleAlert, component: RiskAnalysis},
  { name: "Users", icon: Users, component: UsersFrag},
  { name: "Profile", icon: User, component: Profile}
  // { name: "Reports", icon: FileText, component: Reports },
  // { name: "Accounts", icon: Shield, component: Accounts }
];

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const ActiveComponent = navItems.find(item => item.name === activeTab)?.component || (() => <div>Select a tab</div>);

  return (
    <div className="flex h-screen bg-[#F6F6F3]">
      <div
        className={`m-5 rounded-xl shadow-[0_0_32px_2px_rgba(0,0,0,0.15)] ${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-white border-r shadow-sm p-4 flex flex-col justify-between`}
      >
        <div>
          {/* Logo & Collapse button */}
          <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}>
            <img
              src={sailLogo}
              alt="SAIL logo"
              className={`h-10 transition-all duration-300 ${
                collapsed ? "hidden" : "ml-2"
              }`}
            /> 
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {collapsed ? <Menu /> : <X />}
            </button>
          </div>

          {/* Search */}
          {/* {!collapsed && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
          )} */}

          {/* Nav items */}
          <nav className="space-y-2">
            {navItems.map(({ name, icon: Icon }) => (
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

        {/* Footer section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-sail_red hover:text-white duration-200">
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin"
              className="rounded-full w-8 h-8"
            />
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">Admin SAIL</p>
                <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <Settings className="w-5 h-5" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <LogOut className="w-5 h-5 text-red-500" />
              {!collapsed && <span className="text-sm text-red-500">Log out</span>}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        <ActiveComponent/>
      </main>
    </div>
  );
}
