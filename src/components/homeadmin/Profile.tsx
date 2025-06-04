import { SquarePen, RotateCcwKey } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-10">
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="flex justify-between items center text-sm mb-6">
          <p className="text-xl h-[100%] font-semibold mb-10r">Personal Information</p>
          <div className="flex space-x-6 text-gray-700">
            <button className="flex items-center hover:underline">
              <SquarePen className="h-5 w-5 mr-2"/>
              Update Info
            </button>
            <button className="flex items-center hover:underline">
              <RotateCcwKey className="h-5 w-5 mr-2"/>
              Change Password
            </button>
            <button className="flex items-center hover:underline">
              <RotateCcwKey className="h-5 w-5 mr-2"/>
              Change Password
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[20%] p-8">
            <img
              src="https://i.pravatar.cc/40" 
              alt="Profile Image"
              className="h-full w-full rounded-xl"
            />
          </div>
          <div className="grid grid-cols-3 w-[75%] items-center">
            <p className="font-semibold text-gray-600 text-sm">Patient ID: <span className="font-normal text-gray-500 ml-1"> 202500000</span></p>
            <p className="font-semibold text-gray-600 text-sm">First Name: <span className="font-normal text-gray-500 ml-1"> First Name</span></p>
            <p className="font-semibold text-gray-600 text-sm">Last Name: <span className="font-normal text-gray-500 ml-1"> Last Name</span></p>
            <p className="font-semibold text-gray-600 text-sm">Sex Assigned at Birth: <span className="font-normal text-gray-500 ml-1"> Male</span></p>
            <p className="font-semibold text-gray-600 text-sm">Gender: <span className="font-normal text-gray-500 ml-1"> Male</span></p>
            <p className="font-semibold text-gray-600 text-sm">Date of Birth: <span className="font-normal text-gray-500 ml-1"> January 1, 2000</span></p>
            <p className="font-semibold text-gray-600 text-sm">Contact Number: <span className="font-normal text-gray-500 ml-1"> +639123456789</span></p>
            <p className="font-semibold text-gray-600 text-sm col-span-2">Email Address: <span className="font-normal text-gray-500 ml-1"> emailaddress@gmail.com</span></p>
            <p className="font-semibold text-gray-600 text-sm col-span-3">Address <span className="font-normal text-gray-500 ml-1"> 2nd Floor Unit 2B, 9651 Kamagong Building, Kamagong St., Makati City, Metro Manila</span></p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Profile;