import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChecklistRow from "../components/ChecklistRow";
import ReadinessBar from "../components/ReadinessBar";
import ReadinessBreakdownCard from "../components/ReadinessBreakdownCard";
import { preparednessChecklist } from "../data/checklist";
import { getUserArea } from "../storage/preferenceStorage";
import { calculateReadinessScore, getChecklistStatus, getQuizResults, saveChecklistStatus } from "../storage/readinessStorage";
import { getReports } from "../storage/reportStorage";
import { globalStyles, spacing } from "../styles/globalStyles";
import { getActiveReportCount } from "../utils/reportStatus";

const PreparednessScreen = ({ navigation, refreshKey }) => {
  const [checklistStatus, setChecklistStatus] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [reports, setReports] = useState([]);
  const [userArea, setUserArea] = useState("Islandwide");

  const loadData = async () => {
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
    loadData();
  }, [refreshKey]);

  const toggleChecklist = async (itemId) => {
    const nextStatus = {
      ...checklistStatus,
      [itemId]: !checklistStatus[itemId]
    };
    setChecklistStatus(nextStatus);
    await saveChecklistStatus(nextStatus);
  };

  const readiness = calculateReadinessScore({
    checklistStatus,
    checklistItems: preparednessChecklist,
    quizResults,
    reportCount: reports.length,
    activeReportCount: getActiveReportCount(reports),
    userArea
  });

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <Text style={globalStyles.title}>Preparedness</Text>
      <Text style={globalStyles.subtitle}>
        Complete practical tasks and quizzes to build readiness before an incident occurs.
      </Text>

      <ReadinessBar score={readiness.score} />
      <ReadinessBreakdownCard readiness={readiness} />

      <View style={globalStyles.card}>
        <Text style={{ fontWeight: "900", fontSize: 17, marginBottom: spacing.sm }}>Preparedness quiz</Text>
        <Text style={globalStyles.mutedText}>
          Test your understanding of alerts, community reports and safety actions. Your best quiz result contributes to your readiness score.
        </Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Quiz")}>
          <Text style={globalStyles.buttonText}>Start quiz</Text>
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.sectionTitle}>Readiness checklist</Text>
      {preparednessChecklist.map((item) => (
        <ChecklistRow
          key={item.id}
          item={item}
          completed={!!checklistStatus[item.id]}
          onToggle={() => toggleChecklist(item.id)}
        />
      ))}
    </ScrollView>
  );
};

export default PreparednessScreen;
