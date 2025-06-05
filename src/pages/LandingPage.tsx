import React, { useState, useEffect, useRef } from "react";
import heroImage from "../assets/hero.png";
import aboutUsImage from "../assets/about_us.jpg";
import iconBlood from "../assets/blood.png";
import iconMedicine from "../assets/medicine.png";
import iconRibbon from "../assets/ribbon.png";
import iconReport from "../assets/report.png";
import iconStethoscope from "../assets/stethoscope.png";
import logoPartnerManagers from "../assets/partnermanagerlogo.png";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  const location = useLocation();

  // -----------------------------
  // Hero carousel state + refs
  // -----------------------------
  // 0 = first slide, 1 = second slide
  const [currentSlide, setCurrentSlide] = useState<0 | 1>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle between slide 0 ↔ 1
  const toggleSlides = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  };

  // Every 5 seconds, flip to the other slide
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      toggleSlides();
    }, 5000);

    // Cleanup on unmount or when currentSlide changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSlide]);

  // Manual arrow handlers
  const handleNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentSlide(1);
  };
  const handlePrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentSlide(0);
  };

  // -----------------------------------
  // Scroll‐to‐anchor effect (unchanged)
  // -----------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToId = params.get("scrollTo");
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="font-sans">
      <Navbar />

      {/* ------------------------- */}
      {/* Hero Section (Carousel) */}
      {/* ------------------------- */}
      <section className="relative bg-gray-100 text-center text-white overflow-hidden">
        {/* Background image (static) */}
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-120 object-cover opacity-90"
        />

        {/* Overlay container for heading + sliding content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
          {/* Static heading */}

          {/* Sliding content wrapper */}
          <div className="relative w-full max-w-3xl overflow-hidden">
            <div
              className={`flex w-[100%] transition-transform duration-700 ${
                currentSlide === 0 ? "translate-x-0" : "-translate-x-full"
              }`}
            >

              {/* ------------------ Slide 2 ------------------ */}
              <div className="w-full flex-shrink-0 flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-4">
                  Know Your Risk for HIV and STIs
                </h1>
                <p className="mb-[50px] max-w-xl text-lg text-white">
                  Get insights into how safe your recent or upcoming sexual encounters may be. This quick assessment helps you understand and reduce your risk to the HIV and STIs.
                </p>
                <Link to="/riskAssessment">
                  <button className="bg-red-500 px-8 py-5 rounded-xl text-white text-sm font-semibold hover:bg-white hover:text-blue-600 duration-300">
                    Take Risk Assessment
                  </button>
                </Link>
              </div>

              {/* ------------------ Slide 1 ------------------ */}
              <div className="w-full flex-shrink-0 flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-4">
                  Schedule Your Clinic Visit Today
                </h1>
                <p className="mb-[50px] max-w-xl text-lg text-white">
                  Quickly and securely book your clinic appointments at a time that works for you. Avoid long queues, reduce waiting time, and get the care you need—right when you need it.
                </p>
                <Link to="/appointment">
                  <button className="bg-red-500 px-8 py-5 rounded-xl text-white text-sm font-semibold hover:bg-white hover:text-red-600 duration-300">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>

            {/* Arrow controls */}
            {currentSlide === 0 ? (
              /* When on Slide 1, show right arrow (→) */
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform hover:scale-[105%] duration-200 rounded-full p-2 text-white"
              >
                <ArrowRight className="h-7 w-7"/>
              </button>
            ) : (
              /* When on Slide 2, show left arrow (←) */
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform hover:scale-[105%] duration-200 rounded-full p-2 text-white"
              >
                <ArrowLeft className="h-7 w-7"/>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------- */}
      {/* Services Section (unchanged) */}
      {/* ------------------------- */}
      <section id="services" className="py-24 px-4 bg-gray-100 flex justify-center">
        <div>
          <h2 className="text-4xl font-bold text-center text-red-600 mb-24">
            Our Services
          </h2>

          <div className="max-w-7xl w-full mx-32 flex flex-wrap justify-center gap-8">
            {/* First Row (3 columns) */}
            <div className="w-full md:w-[30%] flex-1 min-w-[230px]">
              <ServiceCard
                icon={iconBlood}
                title="HIV Testing"
                description="Confidential HIV screening with same-day results to help you know your status and take informed next steps."
              />
            </div>
            <div className="w-full md:w-[30%] flex-1 min-w-[230px]">
              <ServiceCard
                icon={iconMedicine}
                title="HIV Prevention"
                description="Access to Pre-Exposure Prophylaxis (PrEP), a medication that helps prevent HIV for individuals at higher risk."
              />
            </div>
            <div className="w-full md:w-[30%] flex-1 min-w-[230px]">
              <ServiceCard
                icon={iconRibbon}
                title="HIV Treatment"
                description="Antiretroviral Therapy (ART) services that provide ongoing treatment for individuals living with HIV to maintain a healthy immune system."
              />
            </div>

            {/* Second Row (2 big columns) */}
            <div className="w-full md:w-[48%]">
              <ServiceCard
                icon={iconReport}
                title="Laboratory Testing"
                description="Comprehensive STI and other laboratory tests, including creatinine testing, and screening for syphilis, hepatitis, and related infections."
              />
            </div>
            <div className="w-full md:w-[48%]">
              <ServiceCard
                icon={iconStethoscope}
                title="Doctor Consultation"
                description="In-person consultation with experienced and licensed healthcare providers for sexual health concerns, treatment guidance, and personalized care."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- */}
      {/* About Us Section (unchanged) */}
      {/* ------------------------- */}
      <section id="about" className="flex py-24 px-4 bg-white">
        <div className="max-w-8xl mx-30 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-[52px]">
            <img
              src={aboutUsImage}
              alt="About Us"
              className="rounded-3xl shadow-md"
            />
          </div>
          <div className="h-full pr-32 flex flex-col justify-center">
            <div>
              <h2 className="text-4xl font-bold text-red-600 mb-12">
                About Us
              </h2>
              <p className="mb-8 text-md">
                We are <strong>SAIL Clinic: Saving and improving lives.</strong>
              </p>
              <p className="mb-8 text-md">
                The SAIL Clinic provides compassionate, individualized,
                discreet, high-quality, and affordable HIV services including HIV
                screening, PrEP, HIV treatment.
              </p>
              <p className="mb-16 text-md">
                Managed by <strong>Sustained Health Initiatives of the
                Philippines - SHIP</strong> and in partnership with{" "}
                <strong>PEPFAR, USAID, and Epic</strong>, we bring access to
                sexual health services to communities desperately needing care
                and support.
              </p>
              <img src={logoPartnerManagers} alt="Partner Managers" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div
    className="h-full bg-white rounded-xl shadow-lg p-6 text-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
  >
    <img
      src={icon}
      alt={title}
      className="w-16 h-16 mx-auto my-10 transition-transform duration-300 group-hover:scale-110"
    />
    <h3 className="font-bold text-lg mb-4">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default LandingPage;