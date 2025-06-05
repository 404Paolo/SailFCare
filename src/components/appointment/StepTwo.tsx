import React, { useState } from "react";
import { appointmentTypes } from "../../data/AppointmentTypes";
import { format, addDays, isBefore, addHours } from "date-fns";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateFormData: (data: Partial<any>) => void;
  formData: any;
}

const StepTwo: React.FC<Props> = ({ onNext, onBack, updateFormData, formData }) => {
  const [selectedTime, setSelectedTime] = useState(formData.time || "");
  const [selectedDate, setSelectedDate] = useState(formData.date || "");
  const [selectedDoctor, setSelectedDoctor] = useState(formData.appointmentDoctor);
  const [startIndex, setStartIndex] = useState(0); // For pagination

  const upcomingDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)); // 14 future days
  const timeSlots = ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  const visibleDates = upcomingDates.slice(startIndex, startIndex + 2);

  const isSlotDisabled = (dateObj: Date, timeStr: string) => {
    const [hour, minute, meridian] = timeStr.match(/(\d+):(\d+) (\w+)/)!.slice(1);
    const hour24 = parseInt(hour) + (meridian === "PM" && hour !== "12" ? 12 : 0);
    const slotDateTime = new Date(dateObj);
    slotDateTime.setHours(hour24, parseInt(minute), 0, 0);
    return isBefore(slotDateTime, addHours(new Date(), 1));
  };

  const handleNextDays = () => {
    if (startIndex + 2 < upcomingDates.length) setStartIndex(startIndex + 2);
  };

  const handlePrevDays = () => {
    if (startIndex > 0) setStartIndex(startIndex - 2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    updateFormData({ date });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateFormData({ time });
  };

  const handleDoctorSelect = (doctor: string) => {
    setSelectedDoctor(doctor);
    updateFormData({ doctor });
  };

  const appointmentType = appointmentTypes[formData.subOption];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-5xl text-red-500 font-bold mb-10 text-center">Select {formData.subOption && "Doctor,"} Date & Time</h2>
      <p className="text-md mb-10 text-center">
        We're the newest private clinics in town for your HIV Primary Care needs.
        <br /> Visit us for your sexual health needs. <strong>Appointments are required.</strong>
      </p>

      <div className="w-full max-w-2xl space-y-4 text-xl">
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <h3 className="text-lg pb-6 font-semibold mb-6 border-b border-[black]">{appointmentType.appointmentHeader}<span className="float-right font-normal">{appointmentType.appointmentDuration}</span></h3>
          <div className="flex items-center gap-4 py-4">
            <img src={appointmentType.appointmentImage} alt="HIV Test" className="w-[45%] h-auto object-cover rounded-2xl" />
            <p className="text-[16px] text-gray-600">
              {appointmentType.appointmentDescription}
            </p>
          </div>
        </div>

      {formData.subOption === "Doctor Consultation" && (
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <h3 className="text-lg pb-6 font-semibold mb-6 border-b border-[black]">Doctor <span className="float-right font-normal text-[16px]"> Sail Clinic Makati</span></h3>
          <div className="flex flex-col items-center gap-4 py-4">
          {appointmentType.doctorLists?.map((name) => (
            <button 
              className={`py-3 w-[95%] rounded-xl text-[16px] border transition-colors duration-150 ${
                selectedDoctor === name ? 
                "text-white font-semibold bg-red-500 hover:bg-white hover:border-red-500 hover:text-red-500" : 
                "text-red-500 border-red-500 hover:bg-red-100"}`}
              onClick={() => {handleDoctorSelect(name);}}>
              Doc {name}
            </button>
          ))}
          </div>
        </div>
      )}
        
        <div className="p-10 bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-3xl mt-6">
          <div className="mb-6 border-b border-black pb-4 flex justify-between">
            <h4 className="text-lg font-semibold">Date & Time</h4>
            <span className="text-sm text-gray-500">Manila (GMT+08:00)</span>
          </div>

          <div className="flex gap-4 mb-4">
              <button
                onClick={handlePrevDays}
                disabled={startIndex === 0}
                className={`px-4 py-2 rounded-full text-gray-400 flex w-16 h-16 text-[18px] ${
                  startIndex === 0
                    ? "collapse"
                    : "hover:text-gray-700 duration-200"
                }`}
              >
                <span className="text-[36px]">&#129168;</span>
              </button>

            <div className="grid grid-cols-2 gap-4 w-full">
              {visibleDates.map((dateObj) => {
                const dateStr = format(dateObj, "MMM d");
                const dayStr = format(dateObj, "EEEE");

                return (
                  <div key={dateStr} className="text-center">
                    <h5 className="text-[16px] font-medium">{dayStr}</h5>
                    <p className="text-sm text-gray-500">{dateStr}</p>
                    <div className="grid gap-2 mt-2 place-items-center">
                      {timeSlots.map((timeStr) => {
                        const disabled = isSlotDisabled(dateObj, timeStr);
                        const selected = selectedDate === dateStr && selectedTime === timeStr;

                        return (
                          <button
                            key={`${dateStr}-${timeStr}`}
                            disabled={disabled}
                            onClick={() => {
                              handleDateSelect(dateStr);
                              handleTimeSelect(timeStr);
                            }}
                            className={`py-2 w-[70%] text-sm rounded-xl border transition-all duration-150 ${
                              selected
                                ? "bg-red-500 text-white"
                                : disabled
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-red-500 border-red-500 hover:bg-red-100"
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNextDays}
              disabled={startIndex + 2 >= upcomingDates.length}
              className={`px-4 py-2 rounded-full flex ${
                startIndex + 2 >= upcomingDates.length
                  ? "collapse"
                  : "text-gray-400 hover:text-gray-700 duration-200"
              }`}
            >
              <span className="text-[36px]">&#129170;</span>
            </button>
          </div>
        </div>
      </div>
      

      <div className="flex justify-between space-x-10 mt-8">
        <button onClick={onBack} className="text-sm bg-white shadow px-4 py-2 border-2px rounded text-gray-700">Back</button>
        <button onClick={onNext} className="text-sm bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">Next</button>
      </div>
    </div>
  );
};

export default StepTwo;
