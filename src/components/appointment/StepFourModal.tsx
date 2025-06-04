import React from "react";

interface Props {
  onBack: () => void;
  updateFormData: (data: Partial<any>) => void;
  formData: any;
}


const StepFourModal: React.FC<Props> = ({onBack}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold pb-6 mb-6 border-b border-[black]">Appointment Confirmed!</h2>
        <p className="text-lg mb-6">
          Your appointment has been successfully booked.
          <br />
          Want to save this appointment to your account and view your booking history?
          Create an account or log in to keep track of your visits and health records.
        </p>
        <div className="grid grid-col-1 gap-4">
          <button className="text-lg px-4 py-2 rounded-xl bg-white text-sail_red font-semibold border-[3px] border-sail_red hover:bg-sail_red hover:text-white duration-200">Register</button>
          <button className="text-lg px-4 py-2 rounded-xl bg-white text-sail_red font-semibold border-[3px] border-sail_red hover:bg-sail_red hover:text-white duration-200">Log In</button>
          <button className="text-lg px-4 py-2 hover:underline" onClick={onBack}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
};

export default StepFourModal;
