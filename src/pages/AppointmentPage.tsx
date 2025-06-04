import { useState } from "react";
import StepOne from "../components/appointment/StepOne";
import StepTwo from "../components/appointment/StepTwo";
import StepThree from "../components/appointment/StepThree";
import StepFourModal from "../components/appointment/StepFourModal";
import Navbar from '../components/NavBar';
import type { Appointment } from "../models/Appointment";

const AppointmentPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<Appointment>({
    appointmentType: "",
    dateTime: Date.now(),
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    appointmentDoctor: undefined,
    creatineResultImage: undefined,
    ohasisReferralCode: undefined,
    ohasisTransferKey: undefined,
    csbMotivatorName: undefined,
    dateMade: Date.now(),
  });

  const updateFormData = (updates: Partial<Appointment>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    window.scrollTo(0,0);
    setStep((prev) => prev + 1)
  };

  const prevStep = () => {
    window.scrollTo(0,0);
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sail_gray">
      <Navbar/>
      <main className="flex-grow p-6">
        {step === 1 && <StepOne onNext={nextStep} updateFormData={updateFormData} formData={formData} />}
        {step === 2 && <StepTwo onNext={nextStep} onBack={prevStep} updateFormData={updateFormData} formData={formData} />}
        {step === 3 && <StepThree onNext={nextStep} onBack={prevStep} updateFormData={updateFormData} formData={formData} />}
        {step === 4 && <StepFourModal onBack={prevStep} updateFormData={updateFormData} formData={formData}/>}
      </main>
    </div>
  );
};

export default AppointmentPage;
