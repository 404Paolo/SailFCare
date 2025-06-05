// src/components/modal/EditUserModal.tsx
import React, { useEffect, useState } from "react";

interface UserRecord {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface EditUserModalProps {
  user: UserRecord;
  onClose: () => void;
  onSave: (updatedUser: UserRecord) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  // Controlled form state, pre‐filled from `user` prop:
  const [lastName, setLastName] = useState(user.lastName);
  const [firstName, setFirstName] = useState(user.firstName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  // If the `user` prop ever changes, re‐initialize the form fields:
  useEffect(() => {
    setLastName(user.lastName);
    setFirstName(user.firstName);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  const handleSubmit = () => {
    if (!lastName || !firstName || !email || !phone || !role || !status) {
      alert("Please fill out all required fields.");
      return;
    }
    onSave({
      id: user.id,
      lastName,
      firstName,
      email,
      phone,
      role,
      status,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Edit User</h2>

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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Email, Phone */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Role, Status */}
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;