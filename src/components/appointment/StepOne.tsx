import React, { useState } from "react";
import clsx from "clsx"; // optional for cleaner conditional classes

interface Props {
  onNext: () => void;
  updateFormData: (data: Partial<any>) => void;
  formData: any;
}

const StepOne: React.FC<Props> = ({ onNext, updateFormData, formData }) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [type, subOption] = e.target.value.split("::");
    updateFormData({ appointmentType: type, subOption });
  };

  const toggleExpand = (type: string) => {
    setExpandedType((prev) => (prev === type ? null : type));
  };

  const options = [
    {
      type: "First Visit to the Clinic",
      subOptions: ["Rapid HIV Test", "Start your HIV Treatment", "Start your PrEP"],
    },
    {
      type: "Follow-UP Visit to the Clinic",
      subOptions: ["Rapid HIV Test", "ARV Refill Pickup", "PrEP Refill Pickup", "Doctor Consultation"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-5xl text-red-500 font-bold mb-10 text-center">Select Appointment Type</h2>
      <p className="text-md mb-10 text-center">
        We're the newest private clinic in town for your HIV Primary Care needs. <br />
        Visit us for your sexual health needs. <b>Appointments are required.</b>
      </p>

      <div className="w-full max-w-2xl space-y-4 text-md">
        {options.map((group) => (
          <div key={group.type} className="p-5 bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <button
              type="button"
              onClick={() => toggleExpand(group.type)}
              className="w-full text-left px-6 py-6 bg-white font-semibold text-lg"
            >
              {group.type}
            </button>

            <div
              className={clsx(
                "transition-all duration-300 overflow-hidden",
                expandedType === group.type ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="border-t border-black">
                {group.subOptions.map((sub) => {
                  const isSelected =
                    formData.appointmentType === group.type && formData.subOption === sub;

                  return (
                    <div className="py-2 border-b border-[#cccccc] last:border-b-0">
                      <label
                        key={sub}
                        className={clsx(
                          "block cursor-pointer p-4 rounded",
                          isSelected ? "bg-sail_red text-white hover:bg-red-500 duration-200" : "hover:bg-sail_red hover:text-white transition-colors duration-300"
                        )}
                      >
                        <input
                          type="radio"
                          name="appointmentType"
                          value={`${group.type}::${sub}`}
                          checked={isSelected}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {sub}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => {
          if (!formData.subOption) alert("Please select the type of service first");
          else onNext();
        }}
        className="text-sm mt-10 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Next
      </button>
    </div>
  );
};

export default StepOne;