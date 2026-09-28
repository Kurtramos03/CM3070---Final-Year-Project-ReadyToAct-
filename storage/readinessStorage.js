import AsyncStorage from "@react-native-async-storage/async-storage";

const CHECKLIST_KEY = "@readytoact/checklist_status";
const QUIZ_RESULTS_KEY = "@readytoact/quiz_results";

export const getChecklistStatus = async () => {
  try {
    const stored = await AsyncStorage.getItem(CHECKLIST_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Unable to load checklist status", error);
    return {};
  }
};

export const saveChecklistStatus = async (status) => {
  await AsyncStorage.setItem(CHECKLIST_KEY, JSON.stringify(status));
};

export const getQuizResults = async () => {
  try {
    const stored = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Unable to load quiz results", error);
    return [];
  }
};

export const addQuizResult = async (result) => {
  const results = await getQuizResults();
  const nextResults = [result, ...results].slice(0, 10);
  await AsyncStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(nextResults));
  return nextResults;
};

export const clearReadinessData = async () => {
  await AsyncStorage.multiRemove([CHECKLIST_KEY, QUIZ_RESULTS_KEY]);
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const calculateReadinessScore = ({
  checklistStatus = {},
  checklistItems = [],
  quizResults = [],
  reportCount = 0,
  activeReportCount = reportCount,
  userArea = "Islandwide"
}) => {
  const completedChecklist = checklistItems.filter((item) => checklistStatus[item.id]).length;
  const checklistTotal = checklistItems.length || 1;
  const checklistPercent = Math.round((completedChecklist / checklistTotal) * 100);
  const checklistPoints = Math.round((completedChecklist / checklistTotal) * 40);

  const bestQuizPercent = quizResults.length > 0 ? Math.max(...quizResults.map((result) => result.percent || 0)) : 0;
  const latestQuizPercent = quizResults[0]?.percent || 0;
  const quizPoints = Math.round(bestQuizPercent * 0.35);

  const reportPoints = Math.min((activeReportCount || 0) * 5, 10);
  const areaPoints = userArea && userArea !== "Islandwide" ? 5 : 0;
  const score = clamp(checklistPoints + quizPoints + reportPoints + areaPoints, 0, 100);

  const breakdown = [
    {
      key: "checklist",
      label: "Checklist progress",
      points: checklistPoints,
      maxPoints: 40,
      helper: `${completedChecklist}/${checklistItems.length} tasks completed`,
      nextAction: completedChecklist === checklistItems.length ? "All checklist tasks completed." : "Complete more before/during/after preparedness tasks."
    },
    {
      key: "quiz",
      label: "Best quiz result",
      points: quizPoints,
      maxPoints: 35,
      helper: quizResults.length > 0 ? `${bestQuizPercent}% best score` : "No quiz completed yet",
      nextAction: bestQuizPercent >= 80 ? "Quiz confidence target reached." : "Retake the quiz and aim for 80% or above."
    },
    {
      key: "reports",
      label: "Active community reports",
      points: reportPoints,
      maxPoints: 10,
      helper: `${activeReportCount || 0} recent report(s) counted`,
      nextAction: activeReportCount > 0 ? "Recent reporting participation counted." : "Submit a local observation when it is safe and useful."
    },
    {
      key: "area",
      label: "My Area preference",
      points: areaPoints,
      maxPoints: 5,
      helper: userArea && userArea !== "Islandwide" ? `${userArea} selected` : "No specific area selected",
      nextAction: userArea && userArea !== "Islandwide" ? "Area-based alert personalisation enabled." : "Choose a specific My Area in the Alerts tab."
    }
  ];

  return {
    score,
    completedChecklist,
    checklistTotal: checklistItems.length,
    checklistPercent,
    checklistPoints,
    quizPoints,
    reportPoints,
    areaPoints,
    bestQuizPercent,
    latestQuizPercent,
    activeReportCount,
    breakdown
  };
};
