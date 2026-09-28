import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ReportCard from "../components/ReportCard";
import { USER_AREAS } from "../data/areas";
import { getUserArea } from "../storage/preferenceStorage";
import { addReport, clearReports, deleteReport, getReports } from "../storage/reportStorage";
import { colors, globalStyles, spacing } from "../styles/globalStyles";
import { getReportTrustStatus, REPORT_EXPIRY_HOURS } from "../utils/reportStatus";

const REPORT_TYPES = ["Ponding", "Blocked Path", "Fallen Branch", "Heavy Rain", "Lift/Building Issue", "Other"];
const SEVERITY_OPTIONS = ["Low", "Moderate", "High"];
const STATUS_FILTERS = ["All", "Recent observation", "Needs confirmation", "Expired"];

const CommunityReportScreen = ({ refreshKey }) => {
  const [type, setType] = useState("Ponding");
  const [severity, setSeverity] = useState("Moderate");
  const [area, setArea] = useState("East");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const loadReports = async () => {
    const [savedReports, savedArea] = await Promise.all([getReports(), getUserArea()]);
    setReports(savedReports);
    if (savedArea && savedArea !== "Islandwide") {
      setArea(savedArea);
    }
  };

  useEffect(() => {
    loadReports();
  }, [refreshKey]);

  const renderChip = (value, selectedValue, onPress) => {
    const selected = value === selectedValue;
    return (
      <TouchableOpacity
        key={value}
        style={[globalStyles.chip, selected && globalStyles.chipActive]}
        onPress={() => onPress(value)}
      >
        <Text style={[globalStyles.chipText, selected && globalStyles.chipTextActive]}>{value}</Text>
      </TouchableOpacity>
    );
  };

  const resetForm = () => {
    setType("Ponding");
    setSeverity("Moderate");
    setLocation("");
    setDescription("");
  };

  const handleSubmit = async () => {
    const cleanLocation = location.trim();
    const cleanDescription = description.trim();

    if (!cleanLocation) {
      Alert.alert("Location needed", "Please enter the specific location or nearby landmark.");
      return;
    }

    if (cleanDescription.length < 10) {
      Alert.alert("More detail needed", "Please add a short description with at least 10 characters.");
      return;
    }

    setSaving(true);

    try {
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + REPORT_EXPIRY_HOURS * 60 * 60 * 1000);
      const report = {
        id: `report-${Date.now()}`,
        type,
        severity,
        area,
        location: `${cleanLocation} (${area})`,
        description: cleanDescription,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        verificationStatus: "Unverified"
      };
      const nextReports = await addReport(report);
      setReports(nextReports);
      resetForm();
      Alert.alert("Report saved", `Your community report has been saved locally. It remains unverified and will be treated as expired after ${REPORT_EXPIRY_HOURS} hours.`);
    } catch (error) {
      Alert.alert("Unable to save", "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reportId) => {
    const nextReports = await deleteReport(reportId);
    setReports(nextReports);
  };

  const handleClear = () => {
    Alert.alert("Clear reports", "This will remove all locally saved community reports.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearReports();
          setReports([]);
        }
      }
    ]);
  };

  const reportsWithStatus = useMemo(() => {
    return reports.map((report) => ({
      ...report,
      trustStatus: getReportTrustStatus(report)
    }));
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reportsWithStatus.filter((report) => statusFilter === "All" || report.trustStatus.label === statusFilter);
  }, [reportsWithStatus, statusFilter]);

  const activeCount = reportsWithStatus.filter((report) => !report.trustStatus.isExpired).length;
  const expiredCount = reportsWithStatus.filter((report) => report.trustStatus.isExpired).length;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView
        style={globalStyles.screen}
        contentContainerStyle={globalStyles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <Text style={globalStyles.title}>Community Reports</Text>
        <Text style={globalStyles.subtitle}>
          Submit local observations to support awareness. Reports are saved locally and clearly marked as unverified.
        </Text>

        <View style={globalStyles.noticeCard}>
          <Text style={globalStyles.noticeText}>
            Do not move towards unsafe areas to submit a report. Reports expire after {REPORT_EXPIRY_HOURS} hours because local conditions can change quickly.
          </Text>
        </View>

        <View style={[globalStyles.row, { marginBottom: spacing.md }]}> 
          <View style={[globalStyles.compactCard, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={globalStyles.smallText}>Active reports</Text>
            <Text style={{ color: colors.primary, fontSize: 22, fontWeight: "900" }}>{activeCount}</Text>
          </View>
          <View style={[globalStyles.compactCard, { flex: 1, marginLeft: spacing.sm }]}>
            <Text style={globalStyles.smallText}>Expired reports</Text>
            <Text style={{ color: colors.danger, fontSize: 22, fontWeight: "900" }}>{expiredCount}</Text>
          </View>
        </View>

        <Text style={globalStyles.label}>Report type</Text>
        <View style={globalStyles.chipRow}>{REPORT_TYPES.map((item) => renderChip(item, type, setType))}</View>

        <Text style={globalStyles.label}>Severity</Text>
        <View style={globalStyles.chipRow}>{SEVERITY_OPTIONS.map((item) => renderChip(item, severity, setSeverity))}</View>

        <Text style={globalStyles.label}>Area</Text>
        <View style={globalStyles.chipRow}>{USER_AREAS.map((item) => renderChip(item, area, setArea))}</View>

        <Text style={globalStyles.label}>Specific location or landmark</Text>
        <TextInput
          style={globalStyles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Example: Tampines Bus Interchange"
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          returnKeyType="next"
        />

        <Text style={globalStyles.label}>Description</Text>
        <TextInput
          style={[globalStyles.input, { minHeight: 90, textAlignVertical: "top" }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Example: Water collecting near the bus stop after heavy rain."
          placeholderTextColor={colors.muted}
          multiline
          blurOnSubmit={false}
          autoCorrect
        />

        <TouchableOpacity style={globalStyles.button} onPress={handleSubmit} disabled={saving}>
          <Text style={globalStyles.buttonText}>{saving ? "Saving..." : "Submit community report"}</Text>
        </TouchableOpacity>

        {reports.length > 0 ? (
          <TouchableOpacity style={globalStyles.dangerButton} onPress={handleClear}>
            <Text style={globalStyles.dangerButtonText}>Clear all local reports</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={globalStyles.sectionTitle}>Recent Community Reports</Text>
        <Text style={[globalStyles.smallText, { marginBottom: spacing.sm }]}>Filter by report status to evaluate trust, expiry and misinformation-control logic.</Text>
        <View style={globalStyles.chipRow}>{STATUS_FILTERS.map((item) => renderChip(item, statusFilter, setStatusFilter))}</View>

        {filteredReports.length > 0 ? (
          filteredReports.map((report) => <ReportCard key={report.id} report={report} onDelete={handleDelete} />)
        ) : (
          <View style={globalStyles.card}>
            <Text style={globalStyles.bodyText}>No reports match this status. Submit a test report to demonstrate local persistence and trust labels.</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommunityReportScreen;
