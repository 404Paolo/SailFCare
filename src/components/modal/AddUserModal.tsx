// src/components/modal/AddUserModal.tsx
import React, { useState } from "react";

interface AddUserModalProps {
  onClose: () => void;
  onSave: (newUser: {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    password: string;
  }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSave }) => {
  // Controlled form state:
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (
      !lastName ||
      !firstName ||
      !email ||
      !phone ||
      !role ||
      !status ||
      !password
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    onSave({
      lastName,
      firstName,
      email,
      phone,
      role,
      status,
      password,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Add New User</h2>

        <div className="space-y-4">
          {/* Row 1: Last Name, First Name */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. Delacruz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Email, Password */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. juandc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Phone */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. 09999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Role, Status */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="case manager">Case Manager</option>
                <option value="clinician">Clinician</option>
                <option value="encoder">Encoder</option>
                <option value="assistant">Assistant</option>
                {/* “patient” is omitted on purpose */}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
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
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;