// src/components/RiskAssessmentForm.tsx
import { Card } from "../components/ui/card";
import React, { useState } from "react";
import RiskAssessmentResult from "./RiskAssessmentResult";

const RiskAssessmentForm: React.FC = () => {
  // 1) **formValues** holds all radio‐button answers.
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  // 2) **showResults** toggles between “show me the form” and “show me the summary”.
  const [showResults, setShowResults] = useState(false);

  // 3) Same weights map you already had.
  const weights: { [group: string]: { [option: string]: number } } = {
    encounter: { PRE: 1, POST: 2 },
    sexType: {
      Vaginal: 1,
      "Anal (Insertive)": 2,
      "Anal (Receptive)": 3,
      Oral: 0.5,
    },
    condomUse: { Yes: 0, No: 3, Sometimes: 1 },
    partnerHiv: {
      "Positive (Detectable)": 3,
      "Positive (Undetectable)": 1,
      Negative: 0,
      Unknown: 2,
    },
    partnerSti: { Yes: 2, No: 0, Unknown: 1 },
    partners: { "1": 0, "2+": 2 },
    artUse: { Yes: -1, No: 2, Irregular: 2, "HIV-": 0 },
    substanceUse: { Yes: 1, No: 0 },
    prepUse: { Yes: -1, No: 2, "2-1-1 Intake": 0 },
    personalSti: { "Diagnosed with STI": 2, "No STI History": 0 },
    personalHiv: { "HIV+ Reactive": 2, Undetectable: 1, Negative: 0 },
    lastTest: {
      Never: 3,
      "More than 6 months": 1,
      "3-6 months": 0.5,
      "Less than 3 months": -1,
    },
  };

  const handleChange = (group: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [group]: value }));
  };

  const handleCalculate = () => {
    // 1) Make sure all questions are answered:
    const requiredGroups = [
      "encounter",
      "sexType",
      "condomUse",
      "partnerHiv",
      "partnerSti",
      "partners",
      "artUse",
      "substanceUse",
      "prepUse",
      "personalHiv",
      "personalSti",
      "lastTest",
    ];

    const unanswered = requiredGroups.filter((g) => !formValues[g]);
    if (unanswered.length > 0) {
      alert("Please answer all questions before calculating.");
      return;
    }

    // 2) If everything is answered, flip to “show results”:
    setShowResults(true);
  };

  // 3) **renderGroup** is unchanged from what you already had:
  const renderGroup = (
    label: string,
    groupName: string,
    options: string[]
  ) => (
    <div className="mb-5" key={groupName}>
      <div className="text-sm font-semibold text-gray-500 mb-2">{label}:</div>
      <div className="flex bg-white shadow w-min h-[80%] rounded-xl p-[3px] gap-[3px]">
        {options.map((option, index) => {
          const isSelected = formValues[groupName] === option;
          const len = options.length;
          return (
            <div className="flex items-center" key={option}>
              <label
                className={`items-center h-full flex cursor-pointer rounded-xl p-2 px-16 text-md transition-all
                  ${
                    isSelected
                      ? "bg-sail_red text-white"
                      : "text-gray-400 border-gray-300 hover:bg-red-400 hover:text-white duration-300"
                  }`}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={option}
                  onChange={() => handleChange(groupName, option)}
                  className="hidden"
                />
                {option}
              </label>
              {index < len - 1 && (
                <div className="w-[1px] h-[80%] bg-gray-300 ml-[3px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // 4) If showResults is true, render <RiskAssessmentResult ... />
  if (showResults) {
    return (
      <RiskAssessmentResult
        values={formValues}
        weights={weights}
        onBack={() => setShowResults(false)}
      />
    );
  }

  // 5) Otherwise, render the form exactly as before:
  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Add Risk Assessment Record</h2>
      <div>
        {renderGroup("Encounter", "encounter", ["PRE", "POST"])}
        {renderGroup("Type of sex", "sexType", [
          "Vaginal",
          "Anal (Insertive)",
          "Anal (Receptive)",
          "Oral",
        ])}
        {renderGroup("Condom Use", "condomUse", ["Yes", "No", "Sometimes"])}
        {renderGroup("Partner HIV Status", "partnerHiv", [
          "Positive (Detectable)",
          "Positive (Undetectable)",
          "Negative",
          "Unknown",
        ])}
        {renderGroup("Partner STI Status", "partnerSti", [
          "Yes",
          "No",
          "Unknown",
        ])}

        <div className="flex gap-24">
          {renderGroup("Partner(s)", "partners", ["1", "2+"])}
          {renderGroup("ART Use (for HIV+ Users)", "artUse", [
            "Yes",
            "No",
            "Irregular",
            "HIV-",
          ])}
        </div>

        <div className="flex gap-24">
          {renderGroup("Substance Use", "substanceUse", ["Yes", "No"])}
          {renderGroup("PrEP Use", "prepUse", ["Yes", "No", "2-1-1 Intake"])}
        </div>

        <div className="flex gap-24">
          {renderGroup("Personal HIV Status", "personalHiv", [
            "HIV+ Reactive",
            "Undetectable",
            "Negative",
          ])}
          {renderGroup("Personal STI History", "personalSti", [
            "Diagnosed with STI",
            "No STI History",
          ])}
        </div>

        <div className="flex gap-24">
          {renderGroup(
            "Time Since Last HIV Test",
            "lastTest",
            ["Never", "More than 6 months", "3-6 months", "Less than 3 months"]
          )}
        </div>

        <div className="fixed bottom-10 right-10">
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setFormValues({})}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCalculate}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentForm;