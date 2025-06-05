// src/pages/RegisterPage.tsx
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { createAppointment } from "../utils/createAppointment";

import logoSail from "../assets/saillogo.png";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

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

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const { assessmentData, appointmentData } = state;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(form.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(form.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Invalid phone number format";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email.trim())
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 1) Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // 2) Write basic profile to “users/{uid}”
      await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        role: "patient",
        createdAt: new Date().toISOString(),
      });

      // 3) If “assessmentData” was passed, merge it now:
      if (assessmentData) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const dataToWrite = Object.entries(assessmentData!).reduce(
            (acc, [key, { response, score }]) => {
              acc[key] = { response, score };
              return acc;
            },
            {} as Record<string, { response: string; score: number }>
          );
          console.log("📤 deep‐cloned snapshot:", JSON.stringify(dataToWrite));
          await updateDoc(userDocRef, { assessmentRecord: dataToWrite });
        } catch (err) {
          console.error("Error writing assessmentData after registration:", err);
        }
      }

      // 4) If “appointmentData” was passed, write that appointment now:
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
          console.error("Error writing appointment after registration:", err);
          alert("Could not finalize your appointment. Please try again.");
        }
      }

      // 5) Navigate to /home
      navigate("/home");
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to register" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F3]">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl-xl shadow-lg max-w-[35%] w-auto text-center"
        >
          <img src={logoSail} alt="SAIL Logo" className="mx-auto mb-6 w-24" />
          <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

          {errors.general && (
            <p className="mb-4 text-red-600 font-semibold">{errors.general}</p>
          )}

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-red-400"
                }`}
              />
            </div>

            <div className="flex-1">
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-red-400"
                }`}
              />
            </div>
          </div>

          <div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
          </div>

          <div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
          </div>

          <div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
          </div>

          <div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
            } text-white w-full py-3 rounded-xl font-semibold transition`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-gray-500 text-xs mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              state={
                assessmentData || appointmentData
                  ? { assessmentData, appointmentData }
                  : undefined
              }
              className="text-red-400 hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;