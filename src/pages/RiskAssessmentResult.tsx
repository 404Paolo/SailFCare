// src/components/RiskAssessmentResult.tsx
import React, { useEffect } from "react";
import { Card } from "../components/ui/card";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export interface RiskAssessmentResultProps {
  values: { [key: string]: string };
  weights: { [groupName: string]: { [option: string]: number } };
  onBack: () => void;
}

const RiskAssessmentResult: React.FC<RiskAssessmentResultProps> = ({
  values,
  weights,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(weights);

  // 1) LABELS map
  const LABELS: { [groupName: string]: string } = {
    encounter: "1. Encounter (Timing of prophylaxis)",
    sexType: "2. Type of Sexual Activity",
    condomUse: "3. Condom Usage",
    partnerHiv: "4. Partner’s HIV Status",
    partnerSti: "5. Partner’s STI Status",
    partners: "6. Number of Sexual Partners",
    artUse: "7. ART Usage (if HIV+)",
    substanceUse: "8. Substance Use Before/During Sex",
    prepUse: "9. PrEP Usage",
    personalHiv: "10. Personal HIV Status",
    personalSti: "11. Personal STI History",
    lastTest: "12. Time Since Last HIV Test",
  };

  // 2) Build rows
  type Row = { label: string; response: string; points: number };
  const rows: Row[] = Object.keys(LABELS).map((groupKey) => {
    const response = values[groupKey] || "N/A";
    const pts =
      weights[groupKey] && typeof weights[groupKey][response] === "number"
        ? weights[groupKey][response]
        : 0;
    return {
      label: LABELS[groupKey],
      response,
      points: pts,
    };
  });

  // 3) Compute totalPoints
  const totalPoints = rows.reduce((acc, row) => acc + row.points, 0);

  // 4) Determine riskLevelText & class
  let riskLevelText = "Low Risk";
  let riskColorClass = "text-green-600";
  if (totalPoints >= 7) {
    riskLevelText = "HIGH RISK";
    riskColorClass = "text-red-600";
  } else if (totalPoints >= 2.5) {
    riskLevelText = "Moderate Risk";
    riskColorClass = "text-yellow-600";
  }

  // 5) Static recommendations
  const recommendationsHighRisk = [
    "Get an HIV and STI test immediately.",
    "Start daily PrEP if eligible.",
    "Use condoms consistently.",
    "Avoid high-risk partners or ensure their HIV/STI status is known.",
    "Engage with a healthcare provider for risk counseling and prevention.",
  ];
  const recommendationsLowRisk = [
    "Keep using condoms and PrEP regularly.",
    "Maintain routine HIV/STI testing every 3-6 months.",
    "Continue practicing open communication with partners.",
  ];
  const recommendationsModerateRisk = [
    "Consider starting daily PrEP for prevention.",
    "Commit to consistent condom use.",
    "Avoid substance use during sex to reduce risky decisions.",
    "Schedule routine HIV/STI screening.",
  ];

  let recommendations = recommendationsLowRisk;
  if (riskLevelText === "HIGH RISK") {
    recommendations = recommendationsHighRisk;
  } else if (riskLevelText === "Moderate Risk") {
    recommendations = recommendationsModerateRisk;
  }

  // ————————————————————————————————————————————————————————————————
  // 6) Build a plain‐JS “recordMap” so that we can pass it via router state:
  //
  //    {
  //      encounter: { response: "...", score: 1 },
  //      sexType: { response: "...", score: 2 },
  //      ...
  //    }
  //
  //    We only use this object for:
  //      • (a) Directly writing to Firestore if user is already logged in, or
  //      • (b) Passing it to /login or /register so that, *after* auth, those pages
  //           can also write it into Firestore.
  const recordMap: Record<string, { response: string; score: number }> = {};
  Object.keys(LABELS).forEach((groupKey) => {
    const response = values[groupKey] || "N/A";
    const pts =
      weights[groupKey] && typeof weights[groupKey][response] === "number"
        ? weights[groupKey][response]
        : 0;
    recordMap[groupKey] = {
      response,
      score: pts,
    };
  });

  // 7) If the user is already logged in, write recordMap → Firestore on mount.
  //    If user == null, skip it (we’ll show a “Log In / Register” banner instead).
  useEffect(() => {
    if (!user) {
      return;
    }

    const saveToFirestore = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          assessmentRecord: recordMap,
        });
      } catch (err) {
        console.error("Error writing assessmentRecord → Firestore:", err);
      }
    };

    saveToFirestore();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-8">
      {/* ======== 1) HEADER CARD ======== */}
      <Card className="p-6 bg-gray-50 border border-gray-200">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            Risk Assessment Results:
          </h3>
          <p className={`text-2xl font-bold ${riskColorClass}`}>
            {riskLevelText}
          </p>
          <p className="text-sm text-gray-600">
            Your assessment results show a{" "}
            <span className={`font-semibold ${riskColorClass}`}>
              {riskLevelText.toLowerCase()}
            </span>{" "}
            potential risk of HIV/STI exposure.
          </p>
        </div>
      </Card>

      {/* ======== 2) SUMMARY TABLE ======== */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-700">
            Risk Assessment Results Summary
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="py-2 px-4 text-left">Risk Factor</th>
                <th className="py-2 px-4 text-left">Response</th>
                <th className="py-2 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {row.label}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {row.response}
                  </td>
                  <td className="py-2 px-4 text-sm text-right font-medium text-gray-800">
                    {row.points}
                  </td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr className="bg-yellow-100">
                <td colSpan={2} className="py-2 px-4 text-right font-semibold">
                  Total Points
                </td>
                <td className="py-2 px-4 text-right font-semibold">
                  {totalPoints}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ======== 3) RECOMMENDATIONS ======== */}
      <Card className="p-6 bg-gray-50 border border-gray-200">
        <h4 className="text-md font-semibold text-gray-700 mb-2">
          Recommendations
        </h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </Card>

      {/* ======== 4) RISK CLASSIFICATION TABLE ======== */}
      <Card className="p-6 bg-white border border-gray-200">
        <h4 className="text-md font-semibold text-gray-700 mb-4">
          Risk Classification
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="py-2 px-4 text-left">Total Score</th>
                <th className="py-2 px-4 text-left">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 text-sm">≤ 2</td>
                <td className="py-2 px-4 text-sm">Low Risk</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2 px-4 text-sm">2.5 – 6.5</td>
                <td className="py-2 px-4 text-sm">Moderate Risk</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 text-sm">≥ 7</td>
                <td className="py-2 px-4 text-sm">High Risk</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-gray-400 text-sm text-center">
        DISCLAIMER: This Risk Assessment is not a diagnostic tool and must not be
        used as medical advice. Consult a medical professional. Visit us now at
        SAIL Clinic Makati where we Save and Improve Lives.
      </div>

      {/* ======== 5b) If NO user, show a Login/Register banner, passing recordMap in state ======== */}
      {!user && (
        <div className="mt-8 text-center bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
          <p className="text-gray-700 mb-2">
            Want to <strong>save your assessment</strong> for future reference?
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              state={{ assessmentData: recordMap }}
              className="inline-block px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              state={{ assessmentData: recordMap }}
              className="inline-block px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentResult;