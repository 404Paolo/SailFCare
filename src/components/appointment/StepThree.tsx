import React from "react";
import { appointmentTypes } from "../../data/AppointmentTypes";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateFormData: (data: Partial<any>) => void;
  formData: any;
}

const StepFour: React.FC<Props> = ({ onNext, onBack, updateFormData, formData }) => {
  const appointmentType = appointmentTypes[formData.subOption];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-5xl font-bold text-red-500 mb-10 text-center">Enter Your Information</h2>
      <p className="text-md text-center text-gray-700 mb-10">
        We're the newest private clinics in town for your HIV Primary Care needs.
        <br />
        Visit us for your sexual health needs.<strong> Appointments are required.</strong>
      </p>

      
      <div className="w-full max-w-2xl space-y-4 text-xl">
        {/* Test Info Card */}
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <h3 className="text-lg pb-6 font-semibold mb-6 border-b border-[black]">{appointmentType.appointmentHeader}<span className="float-right font-normal">{appointmentType.appointmentDuration}</span></h3>
          <div className="flex items-center gap-4 py-4">
            <img src={appointmentType.appointmentImage} alt="HIV Test" className="w-[45%] h-auto object-cover rounded-2xl" />
            <p className="text-[16px] px-4 text-gray-600">
              {appointmentType.appointmentDescription}
            </p>
          </div>
        </div>

        {/* Information Form */}
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="pb-6 flex justify-between items-center mb-6 border-b border-[black]">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <span className="text-[16px] text-gray-500">Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-[black]">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="text-sm border border-gray-300 p-4 rounded-xl"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="text-sm border border-gray-300 p-4 rounded-xl"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="text-sm border border-gray-300 p-4 rounded-xl"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="text-sm border border-gray-300 p-4 rounded-xl"
            />
          </div>
        </div>

      {["Start your PrEP", "PrEP Refill Pickup"].includes(formData.subOption) && (
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <h3 className="text-2xl pb-6 font-semibold mb-6 border-b border-[black]">Creatinine Test Result<span className="float-right font-normal text-gray-500 text-[16px]">Optional</span></h3>
          <div className="flex flex-col items-start gap-4 py-4">
            <p className="text-gray-600 mb-12">
              If you want to fast track your PreP visit, you can do the Creatinine Test at your own time before your visit.<br/><br/>Just upload the result when you book this appointment with us.
            </p>
            <button className="bg-red-500 rounded-xl text-white text-lg px-10 py-2">
              Upload Result
            </button>
          </div>
        </div>
      )}


      {["Start your HIV Treatment", "Start your PrEP", "ARV Refill Pickup", "PrEP Refill Pickup"].includes(formData.subOption) && (
        <div className="p-10 bg-white shadow-lg rounded-lg overflow-hidden">
          <h3 className="text-2xl pb-6 font-semibold mb-6 border-b border-[black]">Referral<span className="float-right font-normal text-gray-500 text-[16px]">Optional</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-[black]">
            <input
              type="text"
              name="referralCode"
              placeholder="OHASIS Referral Code"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-xl"
            />
            <input
              type="text"
              name="transferKey"
              placeholder="OHASIS Transfer Key"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-xl"
            />
            <input
              type="text"
              name="motivatorName"
              placeholder="Name of CBS Motivator"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-xl col-span-2"
            />
          </div>
        </div>
      )}
      </div>
      

      <div className="flex justify-between space-x-10 mt-8">
        <button onClick={onBack} className="text-sm bg-white shadow px-4 py-1 border-2px rounded text-gray-700">Back</button>
        <button onClick={() => {
          if (confirm("Confirm Appointment?")) onNext();
        }} className="text-sm bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">Confirm Appointment</button>
      </div>
    </div>
  );
};

export default StepFour;