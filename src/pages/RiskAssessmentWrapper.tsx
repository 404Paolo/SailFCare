// src/components/RiskAssessmentWrapper.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
  type Unsubscribe as AuthUnsubscribe,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  type DocumentData,
} from "firebase/firestore";

import type { RiskAssessmentResultProps } from "./RiskAssessmentResult";
import RiskAssessmentResult from "./RiskAssessmentResult";
import RiskAssessmentForm from "./RiskAssessmentForm";

// ——————————————
// 1) Initialize Firebase Auth + Firestore
// ——————————————
const auth = getAuth();
const db = getFirestore();

// ——————————————
// 2) (Example) Static weights object.
//    Keys must exactly match the same group‐keys that your Result component expects.
//    In a real app, you might import this from “assessmentWeights.ts” or similar.
// ——————————————
const WEIGHTS: {
  [groupName: string]: { [optionValue: string]: number };
} = {
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
  }
};

type FirestoreUserDoc = DocumentData & {
  // Firestore’s “assessmentRecord” is stored as:
  // {
  //   encounter: { response: string, score: number },
  //   sexType:   { response: string, score: number },
  //   …etc
  // }
  assessmentRecord?: Record<
    string,
    { response: string; score: number }
  >;
};

const RiskAssessmentWrapper: React.FC = () => {
  const navigate = useNavigate();

  // 1) Auth + Loading states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // 2) Firestore‐fetch states
  const [isLoadingDoc, setIsLoadingDoc] = useState<boolean>(false);
  const [docError, setDocError] = useState<string | null>(null);

  // 3) Whether an assessmentRecord exists
  const [hasAssessmentRecord, setHasAssessmentRecord] = useState<boolean>(false);

  // 4) If it exists, we’ll build a “values” map out of it.
  //    (“values” is a map from each question’s key → that question’s response string.)
  const [valuesMap, setValuesMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Subscribe to Firebase Auth
    const unsub: AuthUnsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // As soon as we know auth is NOT loading:
    if (isLoadingAuth) return;

    // If no user is logged in, skip Firestore fetch entirely:
    if (!currentUser) {
      setHasAssessmentRecord(false);
      return;
    }

    // Otherwise: fetch `users/{uid}` from Firestore
    const uid = currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    setIsLoadingDoc(true);
    getDoc(userDocRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as FirestoreUserDoc;

          // If userDoc has “assessmentRecord” field:
          if (
            data.assessmentRecord !== undefined &&
            data.assessmentRecord !== null
          ) {
            setHasAssessmentRecord(true);
            console.log(hasAssessmentRecord);

            // Build a “values” map (groupKey → response string):
            // (RiskAssessmentResult only needs “values” + “weights”.)
            const recordMap = data.assessmentRecord!;
            const extractedValues: { [k: string]: string } = {};
            Object.entries(recordMap).forEach(([groupKey, { response }]) => {
              extractedValues[groupKey] = response;
            });
            setValuesMap(extractedValues);
          } else {
            // doc exists but no `assessmentRecord` field
            setHasAssessmentRecord(false);
            setValuesMap({});
          }
        } else {
          // Document does not exist at all → treat as “no assessmentRecord”
          setHasAssessmentRecord(false);
          setValuesMap({});
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user document:", err);
        setDocError("Could not load your assessment data.");
        setHasAssessmentRecord(false);
      })
      .finally(() => {
        setIsLoadingDoc(false);
      });
  }, [isLoadingAuth, currentUser]);

  // -------------- RENDER FLOW --------------

  if (isLoadingAuth || isLoadingDoc) {
    return <p>Loading...</p>;
  }

  if (docError) {
    return <p className="text-red-600">Error: {docError}</p>;
  }

  // If user is not logged in at all:
  if (!currentUser) {
    return <p>Please log in to view or submit your risk assessment.</p>;
  }

  // If user is logged in but has no assessmentRecord:
  if (!hasAssessmentRecord) {
    return <RiskAssessmentForm />;
  }

  // Otherwise: user *is* logged in, and *does* have an assessmentRecord.
  // We already extracted “valuesMap” from Firestore. Now pass “valuesMap” + “WEIGHTS”
  // into RiskAssessmentResult, plus a simple onBack() that sends them “back to dashboard.”
  const resultProps: RiskAssessmentResultProps = {
    values: valuesMap,
    weights: WEIGHTS,
    onBack: () => {
      // Example: redirect back to “/dashboard”. Change as needed.
      navigate("/home");
    },
  };

  return <RiskAssessmentResult {...resultProps} />;
};

export default RiskAssessmentWrapper;