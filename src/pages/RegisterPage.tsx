import { useState } from "react";
import logoSail from "../assets/saillogo.png";
import logoGoogle from "../assets/google.png";
import Navbar from "@/components/NavBar";

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form validation and submit logic here
    console.log("Form submitted:", form);
  };

  const handleGoogleRegister = () => {
    // Add Google Register logic here
    alert("Google Register clicked");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F3]">
      <Navbar/>
      <div className="flex-1 min-h-screen flex justify-center items-center p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg max-w-[35%] w-auto text-center"
        >
          <img
            src={logoSail}
            alt="SAIL Logo"
            className="mx-auto mb-6 w-24"
          />
          <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="bg-red-500 text-white w-full py-3 rounded font-semibold hover:bg-red-600 transition"
          >
            Register
          </button>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full border border-gray-300 py-2 rounded text-sm hover:bg-gray-100 transition"
          >
            <img
              src={logoGoogle}
              alt="Google"
              className="w-5 mr-3"
            />
            Register with Google
          </button>

          <p className="text-gray-500 text-xs mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-red-400 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
