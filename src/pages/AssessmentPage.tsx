import Navbar from "../components/NavBar";
import RiskAssessmentForm from "./RiskAssessmentForm";

const AssesmentPage = () => {
  return (
    <div className="flex flex-col min-h-screen  bg-[#F6F6F3]">
      <Navbar/>
      <div className="flex flex-1 items-center justify-center py-10">
        <RiskAssessmentForm/>
      </div>
    </div>
  )
}

export default AssesmentPage;