// src/components/Users.tsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../firebase"; // <-- your firebase.ts should export `db`
import { Search, UsersRound, Logs, PenBox, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import AddUserModal from "./../modal/AddUserModal";
import EditUserModal from "./../modal/EditUserModal";
import ConfirmationAlertModal from "./../modal/ConfirmationAlertModal";

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  date_added_to_system?: Timestamp;
  date_hired?: Timestamp;
  createdAt?: string;
}

const Users: React.FC = () => {
  // 1. All users fetched from Firestore
  const [users, setUsers] = useState<UserRecord[]>([]);

  // 2. Search inputs
  const [searchFirstName, setSearchFirstName] = useState<string>("");

  // 3. Filters
  const [selectedRole, setSelectedRole] = useState<string>("All Users");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  // 4. Trigger to re-fetch
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);

  // 5. Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

  // Initialize Firebase Auth & Functions
  const auth = getAuth();
  const functions = getFunctions();

  // === Fetch all users on mount (and whenever reloadFlag toggles) ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        const fetched: UserRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "",
            status: data.status || "",
            date_added_to_system: data.date_added_to_system,
            date_hired: data.date_hired,
            createdAt: data.createdAt,
          };
        });
        setUsers(fetched);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [reloadFlag]);

  // === Compute filteredUsers, excluding anyone whose role is "patient" ===
  const filteredUsers = users.filter((u) => {
    // 1) Exclude all "patient" roles
    if (u.role.toLowerCase() === "patient") {
      return false;
    }

    // 2) Apply Role filter (skip if selectedRole ≠ "All Users")
    if (selectedRole !== "All Users" && u.role.toLowerCase() !== selectedRole.toLowerCase()) {
      return false;
    }

    // 3) Apply Status filter (skip if selectedStatus ≠ "All Status")
    if (
      selectedStatus !== "All Status" &&
      u.status.toLowerCase() !== selectedStatus.toLowerCase()
    ) {
      return false;
    }

    // 4) Search by First Name
    if (
      searchFirstName.trim() !== "" &&
      !u.firstName.toLowerCase().includes(searchFirstName.trim().toLowerCase())
    ) {
      return false;
    }

    // If none of the above rules exclude it, keep this user
    return true;
  });

  // === Handlers for Add / Edit / Delete ===

  // Add User: open modal
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  // Add User: save callback
  const handleAddUserSave = async (newUserData: {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    password: string;
  }) => {
    try {
      const { email, password, firstName, lastName, phone, role, status } = newUserData;

      // 1) Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2) Write Firestore document with the same UID
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
        date_added_to_system: Timestamp.fromDate(new Date()),
        date_hired: Timestamp.fromDate(new Date()),
        createdAt: new Date().toISOString(),
      });

      setReloadFlag((prev) => !prev);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user. See console for details.");
    }
  };

  // Edit User: open modal
  const handleOpenEditModal = (user: UserRecord) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  // Edit User: save callback
  const handleEditUserSave = async (updatedUser: UserRecord) => {
    try {
      const userRef = doc(db, "users", updatedUser.id);
      await updateDoc(userRef, {
        lastName: updatedUser.lastName,
        firstName: updatedUser.firstName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
      });
      setReloadFlag((prev) => !prev);
      setShowEditModal(false);
      setUserToEdit(null);
    } catch (err) {
      console.error("Error editing user:", err);
      alert("Failed to edit user. See console for details.");
    }
  };

  // Delete User: open confirmation
  const handleOpenDeleteConfirm = (user: UserRecord) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Delete User: confirmed callback
  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;
    try {
      const uid = userToDelete.id;

      // 1) Delete from Firestore
      await deleteDoc(doc(db, "users", uid));

      // 2) Delete from Firebase Auth via Cloud Function
      const deleteUserFn = httpsCallable(functions, "deleteUser");
      await deleteUserFn({ uid });

      setReloadFlag((prev) => !prev);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. See console for details.");
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* === Add User Modal === */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUserSave}
        />
      )}

      {/* === Edit User Modal === */}
      {showEditModal && userToEdit && (
        <EditUserModal
          user={userToEdit}
          onClose={() => {
            setShowEditModal(false);
            setUserToEdit(null);
          }}
          onSave={handleEditUserSave}
        />
      )}

      {/* === Delete Confirmation Modal === */}
      {showDeleteConfirm && userToDelete && (
        <ConfirmationAlertModal
          header="Confirm Delete"
          message={`Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`}
          onClose={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteConfirmed}
        />
      )}

      {/* === Search Section === */}
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <p className="text-xl font-semibold mb-10">Search User</p>
        <div className="grid grid-cols-4 mb-6">
          <input
            type="text"
            placeholder="First Name"
            value={searchFirstName}
            onChange={(e) => setSearchFirstName(e.target.value)}
            className="w-[90%] p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <div className="w-full flex justify-start">
            <button
              onClick={() => {
                /* No-op: filtering happens in real time */
              }}
              className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex justify-center items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* === Table & Filters Container === */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        {/* Header Row: Role Filter, Status Filter, Title, Add User */}
        <div className="bg-red-500 text-white flex justify-between items-center w-full rounded-t-md px-4 py-2 text-md font-bold">
          {/* Role + Status Filters */}
          <div className="flex w-[33%] space-x-6">
            <div className="flex items-center space-x-2">
              <UsersRound className="h-4 w-4" />
              <Select
                onValueChange={(val: string) => setSelectedRole(val)}
                value={selectedRole}
              >
                <SelectTrigger className="w-[140px] text-md">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="case manager">Case Manager</SelectItem>
                  <SelectItem value="clinician">Clinician</SelectItem>
                  <SelectItem value="encoder">Encoder</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <UsersRound className="h-4 w-4" />
              <Select
                onValueChange={(val: string) => setSelectedStatus(val)}
                value={selectedStatus}
              >
                <SelectTrigger className="w-[140px] text-md">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Center Title */}
          <div className="w-[33%] text-center">Registered Patients</div>

          {/* Add User Button */}
          <div className="flex items-center w-[33%] justify-end">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 text-white px-4 py-2 rounded-md hover:underline"
            >
              <Logs className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-hidden rounded-b-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[5%]"></th>
                  <th className="p-3 text-center w-[15%]">Last Name</th>
                  <th className="p-3 text-center w-[15%]">First Name</th>
                  <th className="p-3 text-center w-[15%]">Email Address</th>
                  <th className="p-3 text-center w-[15%]">Contact Number</th>
                  <th className="p-3 text-center w-[15%]">Role</th>
                  <th className="p-3 text-center w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-5 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">
                        <div className="flex justify-center items-center space-x-2">
                          <PenBox
                            className="w-5 h-5 text-gray-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => handleOpenEditModal(user)}
                          />
                          <Trash
                            className="w-5 h-5 text-gray-600 hover:text-red-800 cursor-pointer"
                            onClick={() => handleOpenDeleteConfirm(user)}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">{user.lastName}</td>
                      <td className="p-3 text-center">{user.firstName}</td>
                      <td className="p-3 text-center">{user.email}</td>
                      <td className="p-3 text-center">{user.phone}</td>
                      <td className="p-3 text-center">{user.role}</td>
                      <td className="p-3 text-center">{user.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;