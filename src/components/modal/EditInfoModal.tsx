// src/components/modal/EditInfoModal.tsx
import React, { useState, useEffect } from "react";

interface EditInfoModalProps {
  userData: {
    firstName?: string;
    lastName?: string;
    sexAssignedAtBirth?: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
    address?: string;
  };
  onClose: () => void;
  onSave: (updated: {
    firstName?: string;
    lastName?: string;
    sexAssignedAtBirth?: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
    address?: string;
  }) => void;
}

const EditInfoModal: React.FC<EditInfoModalProps> = ({
  userData,
  onClose,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [sexAssignedAtBirth, setSexAssignedAtBirth] = useState(
    userData.sexAssignedAtBirth || ""
  );
  const [gender, setGender] = useState(userData.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState(userData.dateOfBirth || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [address, setAddress] = useState(userData.address || "");

  useEffect(() => {
    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
    setSexAssignedAtBirth(userData.sexAssignedAtBirth || "");
    setGender(userData.gender || "");
    setDateOfBirth(userData.dateOfBirth || "");
    setPhone(userData.phone || "");
    setAddress(userData.address || "");
  }, [userData]);

  const handleSubmit = () => {
    // Basic validation (you can extend this if needed)
    if (!firstName.trim() || !lastName.trim()) {
      alert("First Name and Last Name cannot be empty.");
      return;
    }

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sexAssignedAtBirth: sexAssignedAtBirth.trim(),
      gender: gender.trim(),
      dateOfBirth: dateOfBirth,
      phone: phone.trim(),
      address: address.trim(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Edit Info</h2>

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Sex Assigned at Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sex Assigned at Birth
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={sexAssignedAtBirth}
              onChange={(e) => setSexAssignedAtBirth(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="flex-1 mr-2 border border-red-500 text-red-500 rounded-xl px-4 py-2 hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInfoModal;