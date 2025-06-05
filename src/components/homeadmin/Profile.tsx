// src/components/Profile.tsx
import React, { useState, useEffect } from "react";
import { SquarePen, RotateCcwKey } from "lucide-react";
import profilePic from "../../assets/profilepic.png";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EditInfoModal from "../modal/EditInfoModal";
import ChangePasswordModal from "../modal/ChangePasswordModal";

interface UserData {
  firstName?: string;
  lastName?: string;
  sexAssignedAtBirth?: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  date_hired?: any;
  role?: string;
  status?: string;
}

const Profile: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.data() as UserData);
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSaveInfo = async (updated: UserData) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      firstName: updated.firstName || "",
      lastName: updated.lastName || "",
      sexAssignedAtBirth: updated.sexAssignedAtBirth || "",
      gender: updated.gender || "",
      dateOfBirth: updated.dateOfBirth || "",
      phone: updated.phone || "",
      address: updated.address || "",
    });
    // Refresh local state:
    setUserData((prev) => ({ ...prev, ...updated }));
    setShowEditModal(false);
  };

  const handleChangePassword = async (currentPwd: string, newPwd: string) => {
    if (!user || !user.email) return;
    const credential = EmailAuthProvider.credential(user.email, currentPwd);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPwd);
      alert("Password updated successfully.");
      setShowChangePwdModal(false);
    } catch (error: any) {
      alert("Error changing password: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const displayOrDash = (val?: string) => (val && val !== "" ? val : "--");

  return (
    <div className="space-y-10">
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="flex justify-between items-center text-sm mb-6">
          <p className="text-xl font-semibold">Personal Information</p>
          <div className="flex space-x-6 text-gray-700">
            <button
              className="flex items-center hover:underline"
              onClick={() => setShowEditModal(true)}
            >
              <SquarePen className="h-5 w-5 mr-2" />
              Update Info
            </button>
            <button
              className="flex items-center hover:underline"
              onClick={() => setShowChangePwdModal(true)}
            >
              <RotateCcwKey className="h-5 w-5 mr-2" />
              Change Password
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[20%] p-8">
            <img
              src={profilePic}
              alt="Profile Image"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
          <div className="grid grid-cols-3 w-[75%] items-center gap-y-4">
            <p className="font-semibold text-gray-600 text-sm">
              Patient ID:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {user?.uid || "--"}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              First Name:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.firstName)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              Last Name:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.lastName)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              Sex Assigned at Birth:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.sexAssignedAtBirth)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              Gender:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.gender)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              Date of Birth:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.dateOfBirth)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm">
              Contact Number:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.phone)}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm col-span-2">
              Email Address:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.email || user?.email || "")}
              </span>
            </p>
            <p className="font-semibold text-gray-600 text-sm col-span-3">
              Address{" "}
              <span className="font-normal text-gray-500 ml-1">
                {displayOrDash(userData.address)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditInfoModal
          userData={userData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveInfo}
        />
      )}
      {showChangePwdModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePwdModal(false)}
          onSave={handleChangePassword}
        />
      )}
    </div>
  );
};

export default Profile;
