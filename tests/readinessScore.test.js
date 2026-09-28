function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateReadinessScore({
  checklistCompleted,
  checklistTotal,
  quizPercent,
  activeReports,
  hasArea,
  readResourceCount,
}) {
  const checklistPoints =
    checklistTotal > 0 ? (checklistCompleted / checklistTotal) * 40 : 0;

  const quizPoints = (quizPercent / 100) * 35;

  const reportPoints = Math.min(activeReports * 5, 10);

  const areaPoints = hasArea ? 5 : 0;

  const resourcePoints = Math.min(readResourceCount * 2, 10);

  return Math.round(
    clamp(
      checklistPoints + quizPoints + reportPoints + areaPoints + resourcePoints,
      0,
      100
    )
  );
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, received ${actual}`);
  }
}

assertEqual(
  calculateReadinessScore({
    checklistCompleted: 6,
    checklistTotal: 6,
    quizPercent: 100,
    activeReports: 2,
    hasArea: true,
    readResourceCount: 5,
  }),
  100,
  "Full readiness score should reach 100"
);

assertEqual(
  calculateReadinessScore({
    checklistCompleted: 0,
    checklistTotal: 6,
    quizPercent: 0,
    activeReports: 0,
    hasArea: true,
    readResourceCount: 0,
  }),
  5,
  "My Area alone should give 5 points"
);

console.log("Readiness score tests passed");
