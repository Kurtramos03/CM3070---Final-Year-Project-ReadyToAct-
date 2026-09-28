export const REPORT_EXPIRY_HOURS = 12;
export const REPORT_NEEDS_CONFIRMATION_HOURS = 2;

export const getReportTrustStatus = (report = {}) => {
  const createdAt = report.createdAt ? new Date(report.createdAt) : null;

  if (!createdAt || Number.isNaN(createdAt.getTime())) {
    return {
      label: "Unverified",
      helper: "Submission time is unavailable.",
      tone: "warning",
      ageHours: null,
      isExpired: false
    };
  }

  const ageMs = Date.now() - createdAt.getTime();
  const ageHours = Math.max(0, ageMs / (1000 * 60 * 60));

  if (ageHours >= REPORT_EXPIRY_HOURS) {
    return {
      label: "Expired",
      helper: `Older than ${REPORT_EXPIRY_HOURS} hours. Treat as historical context only.`,
      tone: "danger",
      ageHours,
      isExpired: true
    };
  }

  if (ageHours >= REPORT_NEEDS_CONFIRMATION_HOURS) {
    return {
      label: "Needs confirmation",
      helper: "This report is still unverified and should be checked against newer information.",
      tone: "warning",
      ageHours,
      isExpired: false
    };
  }

  return {
    label: "Recent observation",
    helper: "Recently submitted, but still unverified.",
    tone: "info",
    ageHours,
    isExpired: false
  };
};

export const getActiveReportCount = (reports = []) => {
  return reports.filter((report) => !getReportTrustStatus(report).isExpired).length;
};
