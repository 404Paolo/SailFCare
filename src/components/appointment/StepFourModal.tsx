// src/components/appointment/StepFourModal.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase"; // your firebase.ts that exports `auth`
import { createAppointment } from "../../utils/createAppointment";
import type { Appointment } from "../../models/Appointment"; // or wherever your type is

interface Props {
  onBack: () => void;
  formData: Appointment & { date: string; time: string; }; // must include date/time
  // (If your Appointment type already has date/time, adjust accordingly.)
}

const StepFourModal: React.FC<Props> = ({ onBack, formData }) => {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is logged in, clicking “Confirm” will call createAppointment(...).
  const handleConfirm = async () => {
    if (!user) return; // shouldn’t happen—Confirm is only shown when user != null
    setIsSubmitting(true);

    try {
      await createAppointment(user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        subOption: formData.subOption!,
        appointmentType: formData.appointmentType,
        date: formData.date!,
        time: formData.time!,
      });
      // After successful write, redirect wherever you want:
      navigate("/home");
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert("Something went wrong when booking your appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is NOT logged in, “Confirm” is replaced by “Register” / “Log In” buttons:
  // We pass formData → location.state so that after login/register, we can finalize the appointment.
  const goToRegister = () => {
    navigate("/register", { state: { appointmentData: formData } });
  };
  const goToLogin = () => {
    navigate("/login", { state: { appointmentData: formData } });
  };

  // While firebase-auth is initializing, we can show a loader or nothing:
  if (loadingAuth) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold pb-6 mb-6 border-b border-[black]">
          Appointment {user ? "Confirmed!" : "Next Step"}
        </h2>

        {user ? (
          <>
            <p className="text-lg mb-6">
              Your appointment has been successfully booked.
              <br />
              Want to save this appointment to your account and view your booking history?
            </p>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`text-lg px-4 py-2 rounded-xl bg-red-500 text-white font-semibold ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
              }`}
            >
              {isSubmitting ? "Booking..." : "Confirm & Finish"}
            </button>
            <button
              onClick={onBack}
              className="mt-4 text-lg px-4 py-2 hover:underline"
            >
              Maybe Later
            </button>
          </>
        ) : (
          <>
            <p className="text-lg mb-6">
              You need to be signed in before we can complete your appointment.
              <br />
              Please register or log in to finalize your booking.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={goToRegister}
                className="text-lg px-4 py-2 rounded-xl bg-white text-red-500 font-semibold border-[3px] border-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Register
              </button>
              <button
                onClick={goToLogin}
                className="text-lg px-4 py-2 rounded-xl bg-white text-red-500 font-semibold border-[3px] border-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button onClick={onBack} className="text-lg px-4 py-2 hover:underline">
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepFourModal;