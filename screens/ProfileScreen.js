import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MetricCard from "../components/MetricCard";
import ReadinessBar from "../components/ReadinessBar";
import ReadinessBreakdownCard from "../components/ReadinessBreakdownCard";
import { preparednessChecklist } from "../data/checklist";
import { clearUserArea, getUserArea } from "../storage/preferenceStorage";
import { calculateReadinessScore, clearReadinessData, getChecklistStatus, getQuizResults } from "../storage/readinessStorage";
import { clearReports, getReports } from "../storage/reportStorage";
import { colors, globalStyles, spacing } from "../styles/globalStyles";
import { getActiveReportCount } from "../utils/reportStatus";

const ProfileScreen = ({ refreshKey }) => {
  const [checklistStatus, setChecklistStatus] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [reports, setReports] = useState([]);
  const [userArea, setUserArea] = useState("Islandwide");

  const loadProfile = async () => {
    const [status, results, savedReports, savedArea] = await Promise.all([
      getChecklistStatus(),
      getQuizResults(),
      getReports(),
      getUserArea()
    ]);
    setChecklistStatus(status);
    setQuizResults(results);
    setReports(savedReports);
    setUserArea(savedArea || "Islandwide");
  };

  useEffect(() => {
    loadProfile();
  }, [refreshKey]);

  const activeReportCount = getActiveReportCount(reports);
  const readiness = calculateReadinessScore({
    checklistStatus,
    checklistItems: preparednessChecklist,
    quizResults,
    reportCount: reports.length,
    activeReportCount,
    userArea
  });

  const latestQuiz = quizResults[0];

  const handleReset = () => {
    Alert.alert("Reset local progress", "This clears checklist, quiz results, reports and the saved My Area preference on this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await clearReadinessData();
          await clearReports();
          await clearUserArea();
          await loadProfile();
        }
      }
    ]);
  };

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <Text style={globalStyles.title}>Profile</Text>
      <Text style={globalStyles.subtitle}>
        Track local readiness progress from checklist tasks, quiz performance, area personalisation and community report participation.
      </Text>

      <ReadinessBar score={readiness.score} />

      <View style={[globalStyles.row, { marginBottom: spacing.md }]}> 
        <MetricCard label="Checklist" value={`${readiness.completedChecklist}/${readiness.checklistTotal}`} helper="Tasks done" />
        <MetricCard label="Quiz" value={latestQuiz ? `${latestQuiz.percent}%` : "--"} helper="Latest score" />
        <MetricCard label="Area" value={userArea} helper="My Area" />
      </View>

      <View style={[globalStyles.row, { marginBottom: spacing.md }]}> 
        <MetricCard label="Reports" value={reports.length} helper="Total local" />
        <MetricCard label="Active" value={activeReportCount} helper="Not expired" />
        <MetricCard label="Best quiz" value={`${readiness.bestQuizPercent}%`} helper="Saved" />
      </View>

      <ReadinessBreakdownCard readiness={readiness} />

      <View style={globalStyles.card}>
        <Text style={{ fontWeight: "900", fontSize: 17, color: colors.text }}>Achievements</Text>
        <Text style={[globalStyles.bodyText, { marginTop: spacing.sm }]}> 
          {readiness.completedChecklist >= 3 ? "✅ Preparedness starter\n" : "⬜ Complete 3 checklist tasks\n"}
          {readiness.bestQuizPercent >= 80 ? "✅ Quiz confident\n" : "⬜ Score 80% or above on the quiz\n"}
          {activeReportCount >= 1 ? "✅ Community observer\n" : "⬜ Submit 1 recent community report\n"}
          {userArea !== "Islandwide" ? "✅ My Area personalised" : "⬜ Select a specific My Area"}
        </Text>
      </View>

      <TouchableOpacity style={globalStyles.dangerButton} onPress={handleReset}>
        <Text style={globalStyles.dangerButtonText}>Reset local progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
