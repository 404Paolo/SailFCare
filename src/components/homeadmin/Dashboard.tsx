// components/Dashboard.tsx

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query
} from "firebase/firestore";
import { db } from "../../firebase.ts";
import { parseFirestoreTimestamp } from "../../utils/dateUtils";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

// Now each day object also has “total”
const emptyData = days.map((day) => ({
  name: day,
  "High-Risk": 0,
  "Medium-Risk": 0,
  total: 0,
}));

type Appointment = {
  uid: string;
  full_name: string;
  service_type: string;
  status: string;       // e.g. "On-Going", "High-Risk", etc.
  time: number;
  timestamp: string;    // e.g. "2025-06-02 at 12:00:00 PM UTC+8"
  visit_type: string;
};

export default function Dashboard() {
  // — Instead of “1st Week” / “2nd Week” strings, we maintain a number 1..5
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [month, setMonth] = useState<string>("June");
  const [year, setYear] = useState<string>("2025");

  // Firestore-loaded appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Header-card counts
  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [thisMonthCount, setThisMonthCount] = useState<number>(0);
  const [thisYearCount, setThisYearCount] = useState<number>(0);

  // Chart data (Sun–Sat), with “High-Risk”, “Medium-Risk”, and “total”
  const [chartData, setChartData] = useState(
    () => JSON.parse(JSON.stringify(emptyData)) as typeof emptyData
  );

  // Forecast cards
  const [totalAppointmentForecast, setTotalAppointmentForecast] = useState<number>(0);
  const [highRiskForecast, setHighRiskForecast] = useState<number>(0);
  const [mediumRiskForecast, setMediumRiskForecast] = useState<number>(0);

  // ── 1) Fetch appointments from Firestore on mount ─────────────────────────────
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const q = query(collection(db, "appointments"));
        const snap = await getDocs(q);
        console.log("Fetched appointment IDs:", snap.docs.map((d) => d.id));
        const arr: Appointment[] = snap.docs.map((doc) => doc.data() as Appointment);
        console.log("Fetched appointment data:", arr);
        setAppointments(arr);
      } catch (err) {
        console.error("Error loading appointments:", err);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  // Month name → zero-based index (0 = January … 11 = December)
  const monthMap: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Helper: given a DOM (1..31), returns week-of-month (1..5)
  function getWeekOfMonth(dayOfMonth: number): number {
    // e.g. days 1–7 → week 1; 8–14 → week 2; 15–21 → week 3; 22–28 → week 4; 29–31 → week 5
    return Math.ceil(dayOfMonth / 7); 
  }

  // ── 2) Recompute header counts & chartData when filters or appointments change ─
  useEffect(() => {
    if (loading) return;

    const selectedMonthIdx = monthMap[month] ?? new Date().getMonth();
    const selectedYearNum = parseInt(year, 10);

    // a) Filter by year
    const inYear = appointments.filter((appt) => {
      const dt = parseFirestoreTimestamp(appt.timestamp);
      return dt !== null && dt.getFullYear() === selectedYearNum;
    });
    setThisYearCount(inYear.length);

    // b) Filter by month + year
    const inMonth = inYear.filter((appt) => {
      const dt = parseFirestoreTimestamp(appt.timestamp)!;
      return dt.getMonth() === selectedMonthIdx;
    });
    setThisMonthCount(inMonth.length);

    const weekStartDay = (selectedWeek === 1 ? 1 :
                        selectedWeek === 2 ? 8 :
                        selectedWeek === 3 ? 15 :
                        22);           // for Week 4

    const weekEndDay = (selectedWeek === 1 ? 7 :
                      selectedWeek === 2 ? 14 :
                      selectedWeek === 3 ? 21 :
                      31);            // for Week 4, always go to the end of the month

    const inWeek = inMonth.filter((appt) => {
      const dt = parseFirestoreTimestamp(appt.timestamp)!;
      const dom = dt.getDate();
      return dom >= weekStartDay && dom <= weekEndDay;
    });

    setThisWeekCount(inWeek.length);

    // d) Build fresh chartData for these “inWeek” appointments
    const freshData = days.map((weekday) => ({
      name: weekday,
      "High-Risk": 0,
      "Medium-Risk": 0,
      total: 0,
    }));

    inWeek.forEach((appt) => {
      const dt = parseFirestoreTimestamp(appt.timestamp)!;
      const weekdayName = days[dt.getDay()]; // 0..6 → “Sun”..“Sat”
      const riskKey = appt.status === "High-Risk" ? "High-Risk" : "Medium-Risk";
      const idx = freshData.findIndex((d) => d.name === weekdayName);
      if (idx !== -1) {
        freshData[idx][riskKey] += 1;
        freshData[idx].total += 1;
      }
    });

    console.log("📊 freshData for chart:", freshData);
    setChartData(freshData);
  }, [appointments, selectedWeek, month, year, loading]);

  // ── 3) Recompute forecasts whenever chartData changes ─────────────────────────
  function recalcForecasts() {
    let high = 0;
    let med = 0;
    chartData.forEach((d) => {
      high += d["High-Risk"];
      med += d["Medium-Risk"];
    });

    console.log("🔮 Forecast inputs → high:", high, "med:", med);
    setHighRiskForecast(Math.round(high * 1.2));
    setMediumRiskForecast(Math.round(med * 1.05));
    setTotalAppointmentForecast(Math.round((high + med) * 1.1));
    console.log(
      "🔮 Forecast outputs → total:",
      Math.round((high + med) * 1.1),
      "highRiskForecast:",
      Math.round(high * 1.2),
      "mediumRiskForecast:",
      Math.round(med * 1.05)
    );
  }

  useEffect(() => {
    recalcForecasts();
  }, [chartData]);

  // ── 4) JSX Return ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* ── Header Cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Week</p>
            <p className="text-5xl font-semibold m-4">{thisWeekCount}</p>
            <p className="text-md text-gray-500">
              Number of patients served in Week {selectedWeek}, {month} {year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Month</p>
            <p className="text-5xl font-semibold m-4">{thisMonthCount}</p>
            <p className="text-md text-gray-500">
              Number of patients served in {month} {year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Patients This Year</p>
            <p className="text-5xl font-semibold m-4">{thisYearCount}</p>
            <p className="text-md text-gray-500">
              Number of patients served in {year}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Line Chart – Patient Volume Trend ──────────────────────────────────── */}
      <div className="bg-white overflow-auto rounded-2xl shadow-[0_0_32px_2px_rgba(0,0,0,0.1)] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Patient Volume Trend</p>
          <div className="flex space-x-2">
            {/* Week Selector (1–5) */}
            <Select value={selectedWeek.toString()} onValueChange={(val) => setSelectedWeek(parseInt(val, 10))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Week 1</SelectItem>
                <SelectItem value="2">Week 2</SelectItem>
                <SelectItem value="3">Week 3</SelectItem>
                <SelectItem value="4">Week 4</SelectItem>
              </SelectContent>
            </Select>

            {/* Month Selector (all 12 months) */}
            <Select value={month} onValueChange={(val) => setMonth(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Selector (add more as needed) */}
            <Select value={year} onValueChange={(val) => setYear(val)}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                {/* …add more years if necessary */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Draw both “High-Risk” and “Medium-Risk” lines so you always see something */}
            <Line
              type="monotone"
              dataKey="High-Risk"
              stroke="#ef4444"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Medium-Risk"
              stroke="#f59e0b"
              dot={{ r: 4 }}
            />

            {/* If you want a single “Total” line instead, uncomment this: */}
            {/*
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              dot={{ r: 4 }}
            />
            */}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Forecast Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">Total Appointment Forecast</p>
            <p className="text-5xl font-semibold m-4">
              {totalAppointmentForecast}
            </p>
            <p className="text-sm text-gray-500">
              Weekly forecast (Week {selectedWeek}, {month} {year})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">High-Risk Forecast</p>
            <p className="text-5xl font-semibold m-4">
              {highRiskForecast}
            </p>
            <p className="text-sm text-gray-500">
              Forecast # of high-risk appointments (Week {selectedWeek}, {month} {year})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-md font-semibold">Medium-Risk Forecast</p>
            <p className="text-5xl font-semibold m-4">
              {mediumRiskForecast}
            </p>
            <p className="text-sm text-gray-500">
              Forecast # of medium-risk appointments (Week {selectedWeek}, {month} {year})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Appointment/Walk-In Forecast Graph ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-[0_0_32px_2px_rgba(0,0,0,0.1)] p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Appointment/Walk-In Forecast</p>
          <div className="flex space-x-2">
            {/* Redraw the same selectors so user can update while looking at forecast */}
            <Select value={selectedWeek.toString()} onValueChange={(val) => setSelectedWeek(parseInt(val, 10))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Week 1</SelectItem>
                <SelectItem value="2">Week 2</SelectItem>
                <SelectItem value="3">Week 3</SelectItem>
                <SelectItem value="4">Week 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={month} onValueChange={(val) => setMonth(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={(val) => setYear(val)}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Mirror the two‐line approach here as well */}
            <Line
              type="monotone"
              dataKey="High-Risk"
              stroke="#ef4444"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Medium-Risk"
              stroke="#f59e0b"
              dot={{ r: 4 }}
            />
            {/* <Line type="monotone" dataKey="total" stroke="#3b82f6" dot={{ r: 4 }} /> */}
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 text-right text-sm text-gray-500">
          Forecast last updated on {new Date().toLocaleDateString()}
        </div>
        <div className="mt-4 text-center">
          <Button onClick={recalcForecasts}>Update Forecast</Button>
        </div>
      </div>
    </div>
  );
}
