import AsyncStorage from "@react-native-async-storage/async-storage";

const REPORTS_KEY = "@readytoact/community_reports";

export const getReports = async () => {
  try {
    const storedReports = await AsyncStorage.getItem(REPORTS_KEY);
    return storedReports ? JSON.parse(storedReports) : [];
  } catch (error) {
    console.warn("Unable to load reports", error);
    return [];
  }
};

export const saveReports = async (reports) => {
  try {
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (error) {
    console.warn("Unable to save reports", error);
    throw error;
  }
};

export const addReport = async (report) => {
  const reports = await getReports();
  const nextReports = [report, ...reports];
  await saveReports(nextReports);
  return nextReports;
};

export const deleteReport = async (reportId) => {
  const reports = await getReports();
  const nextReports = reports.filter((report) => report.id !== reportId);
  await saveReports(nextReports);
  return nextReports;
};

export const clearReports = async () => {
  await AsyncStorage.removeItem(REPORTS_KEY);
};
