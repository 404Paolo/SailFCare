import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

const emptyData = days.map(day => ({
  name: day,
  'High-Risk': 0,
  'Medium-Risk': 0,
}));

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('1st Week');
  const [month, setMonth] = useState('May');
  const [year, setYear] = useState('2025');

  return (
    <div className="space-y-10">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Week</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-md text-gray-500">Number of patients served this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Month</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-md text-gray-500">Number of patients served this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Year</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-md text-gray-500">Number of patients served this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Patient Volume Trend */}
      <div className="bg-white overflow-auto rounded-2xl shadow-[0_0_32px_2px_rgba(0,0,0,0.1)] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Patient Volume Trend</p>
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Week">1st Week</SelectItem>
                <SelectItem value="2nd Week">2nd Week</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={emptyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="High-Risk" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">Total Appointment Forecast</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-sm text-gray-500">Weekly forecast of total appointments and walk-ins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">High-Risk Forecast</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-sm text-gray-500">Weekly forecast number of high-risk patient appointments and walk-ins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">Medium-Risk Forecast</p>
            <p className="text-5xl font-semibold m-4">0</p>
            <p className="text-sm text-gray-500">Weekly forecast number of medium-risk patient appointments and walk-ins</p>
          </CardContent>
        </Card>
      </div>

      {/* Walk-In Forecast Graph */}
      <div className="bg-white rounded-2xl shadow-[0_0_32px_2px_rgba(0,0,0,0.1)] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Appointment/Walk-In Forecast</p>
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Week">1st Week</SelectItem>
                <SelectItem value="2nd Week">2nd Week</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={emptyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="High-Risk" stroke="#ef4444" />
            <Line type="monotone" dataKey="Medium-Risk" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-right text-sm text-gray-500">
          Forecast last updated on May 6, 2025
        </div>
        <div className="mt-4 text-center">
          <Button>Update Forecast</Button>
        </div>
      </div>
    </div>
  );
}
