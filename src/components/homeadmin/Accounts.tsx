import { Pencil, Trash2, Plus } from 'lucide-react';

const users = [
  {
    name: 'Matthew Wilson',
    level: 'Super Admin',
    created: '06-03-2021',
    role: '06-03-2021',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Sarah Martinez',
    level: 'Super Admin',
    created: '06-03-2021',
    role: '06-03-2021',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    name: 'Christopher Brown',
    level: 'Admin',
    created: '18-03-2021',
    role: '20-03-2021',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    name: 'Emily Thompson',
    level: 'Manager',
    created: '11-06-2021',
    role: '11-06-2021',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    name: 'David Smith',
    level: 'Manager',
    created: '25-06-2021',
    role: '28-06-2021',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const patients = [
  {
    name: 'Michael Johnson',
    level: 'Patient',
    created: '02-11-2021',
    role: '02-11-2021',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    name: 'Daniel Davis',
    level: 'Patient',
    created: '18-11-2021',
    role: '18-11-2021',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    name: 'Jennifer Taylor',
    level: 'Patient',
    created: '30-12-2021',
    role: '30-12-2021',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const UserTable = ({ title, data }: { title: string; data: typeof users }) => (
  <div className="bg-white rounded-xl shadow p-4 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="py-2">Name</th>
          <th className="py-2">Level</th>
          <th className="py-2">Account Created Date</th>
          <th className="py-2">Role Created Date</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="py-3 flex items-center gap-2">
              <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
              {user.name}
            </td>
            <td className="py-3">{user.level}</td>
            <td className="py-3">{user.created}</td>
            <td className="py-3">{user.role}</td>
            <td className="py-3 flex gap-2">
              <button><Pencil className="w-4 h-4 text-gray-600" /></button>
              <button><Trash2 className="w-4 h-4 text-red-500" /></button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={5} className="py-3 text-center text-gray-400">
            <button className="flex items-center justify-center text-pink-600">
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function Accounts() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">Manage User</h1>
            <p className="text-gray-500 text-sm">Administer and oversee user accounts and privileges within the platform.</p>
          </div>
          <button className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500">Add User</button>
        </div>
        <div className="flex space-x-4 text-sm text-pink-600 border-b border-gray-200">
          <button className="py-2 border-b-2 border-pink-600">Users</button>
          <button className="py-2 text-gray-400">Permissions</button>
        </div>
      </div>
      <UserTable title="SAIL Clinic" data={users} />
      <UserTable title="Patients" data={patients} />
    </div>
  );
}
