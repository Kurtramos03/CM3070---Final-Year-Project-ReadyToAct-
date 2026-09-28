function getReportStatus(createdAt, now = Date.now()) {
  const ageHours = (now - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (ageHours >= 12) return "Expired";
  if (ageHours >= 6) return "Needs confirmation";
  return "Recent observation";
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, received ${actual}`);
  }
}

const now = new Date("2026-09-28T12:00:00+08:00").getTime();

assertEqual(
  getReportStatus("2026-09-28T10:00:00+08:00", now),
  "Recent observation",
  "2-hour-old report should be recent"
);

assertEqual(
  getReportStatus("2026-09-28T05:00:00+08:00", now),
  "Needs confirmation",
  "7-hour-old report should need confirmation"
);

assertEqual(
  getReportStatus("2026-09-27T23:00:00+08:00", now),
  "Expired",
  "13-hour-old report should be expired"
);

console.log("Report status tests passed");
