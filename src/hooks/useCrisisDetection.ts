import { useState, useCallback, useMemo } from "react";

interface CrisisState {
  isDetected: boolean;
  severity: "none" | "low" | "moderate" | "high";
  keywords: string[];
}

const CRISIS_KEYWORDS = {
  high: [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'better off dead', 'no reason to live', 'goodbye forever'
  ],
  moderate: [
    'self-harm', 'hurt myself', 'cutting', 'hopeless',
    'no point', 'give up', 'can\'t go on', 'overdose'
  ],
  low: [
    'depressed', 'worthless', 'burden', 'alone', 'empty',
    'numb', 'tired of living', 'don\'t want to be here'
  ]
};

export const useCrisisDetection = () => {
  const [crisisState, setCrisisState] = useState<CrisisState>({
    isDetected: false,
    severity: "none",
    keywords: []
  });
  const [showResources, setShowResources] = useState(false);

  const checkForCrisis = useCallback((text: string): CrisisState => {
    const lowerText = text.toLowerCase();
    const foundKeywords: string[] = [];
    let severity: CrisisState["severity"] = "none";

    // Check high severity first
    for (const keyword of CRISIS_KEYWORDS.high) {
      if (lowerText.includes(keyword)) {
        foundKeywords.push(keyword);
        severity = "high";
      }
    }

    // Check moderate if no high severity found
    if (severity === "none") {
      for (const keyword of CRISIS_KEYWORDS.moderate) {
        if (lowerText.includes(keyword)) {
          foundKeywords.push(keyword);
          severity = "moderate";
        }
      }
    }

    // Check low if no higher severity found
    if (severity === "none") {
      for (const keyword of CRISIS_KEYWORDS.low) {
        if (lowerText.includes(keyword)) {
          foundKeywords.push(keyword);
          severity = "low";
        }
      }
    }

    const newState: CrisisState = {
      isDetected: foundKeywords.length > 0,
      severity,
      keywords: foundKeywords
    };

    setCrisisState(newState);
    
    // Show resources for moderate and high severity
    if (severity === "high" || severity === "moderate") {
      setShowResources(true);
    }

    return newState;
  }, []);

  const dismissResources = useCallback(() => {
    setShowResources(false);
  }, []);

  const resetCrisis = useCallback(() => {
    setCrisisState({ isDetected: false, severity: "none", keywords: [] });
    setShowResources(false);
  }, []);

  return {
    crisisState,
    showResources,
    checkForCrisis,
    dismissResources,
    resetCrisis
  };
};
