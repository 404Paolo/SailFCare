// src/pages/LoginPage.tsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { createAppointment } from "../utils/createAppointment";

import logo from "../assets/saillogo.png";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

interface LocationState {
  assessmentData?: Record<string, { response: string; score: number }>;
  appointmentData?: {
    firstName: string;
    lastName: string;
    subOption: string;
    appointmentType: string;
    date: string;
    time: string;
    // …any other fields you passed from StepFourModal
  };
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const { assessmentData, appointmentData } = state;

  const login = async () => {
    setLoading(true);
    try {
      // 1. Sign in
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 2. If “assessmentData” was passed, write it to Firestore:
      if (assessmentData) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            assessmentRecord: assessmentData,
          });
        } catch (err) {
          console.error("Failed to write assessmentData after login:", err);
          // we don’t block navigation if this fails
        }
      }

      // 3. If “appointmentData” was passed, write that appointment now:
      if (appointmentData) {
        try {
          await createAppointment(user.uid, {
            firstName: appointmentData.firstName,
            lastName: appointmentData.lastName,
            subOption: appointmentData.subOption,
            appointmentType: appointmentData.appointmentType,
            date: appointmentData.date,
            time: appointmentData.time,
          });
        } catch (err) {
          console.error("Failed to write appointment after login:", err);
          // Optionally show an alert—then still navigate to /home
          alert("Could not finalize your appointment. Please try again later.");
        }
      }

      // 4. Navigate to “/home”
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F3]">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
          <img src={logo} alt="SAIL logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-6">Log In to Your Account</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <button
            onClick={login}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
            } text-white font-medium py-3 rounded-xl transition`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>

          <div className="text-sm text-gray-500 mt-6">
            New patient?{" "}
            <Link
              to="/register"
              state={
                assessmentData || appointmentData
                  ? { assessmentData, appointmentData }
                  : undefined
              }
              className="text-red-400 hover:underline"
            >
              Create your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;