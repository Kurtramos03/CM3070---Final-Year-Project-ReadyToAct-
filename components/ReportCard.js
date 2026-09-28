import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, getSeverityStyle, globalStyles, spacing } from "../styles/globalStyles";
import { getReportTrustStatus } from "../utils/reportStatus";

const getStatusStyle = (tone) => {
  switch (tone) {
    case "danger":
      return { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5", textColor: colors.danger };
    case "info":
      return { backgroundColor: "#DBEAFE", borderColor: "#93C5FD", textColor: colors.primary };
    default:
      return { backgroundColor: "#FEF3C7", borderColor: "#FCD34D", textColor: colors.warning };
  }
};

const ReportCard = ({ report, onDelete }) => {
  const severityStyle = getSeverityStyle(report.severity);
  const trustStatus = getReportTrustStatus(report);
  const statusStyle = getStatusStyle(trustStatus.tone);
  const createdAt = report.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown time";

  return (
    <View style={[styles.card, trustStatus.isExpired && styles.expiredCard]}>
      <View style={globalStyles.spaceBetween}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text style={styles.title}>{report.type}</Text>
          <Text style={styles.location}>📍 {report.location}</Text>
        </View>
        <View style={[globalStyles.badge, { backgroundColor: severityStyle.backgroundColor, borderColor: severityStyle.borderColor }]}> 
          <Text style={[globalStyles.badgeText, { color: severityStyle.textColor }]}>{report.severity}</Text>
        </View>
      </View>

      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.time}>Submitted: {createdAt}</Text>

      <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor, borderColor: statusStyle.borderColor }]}> 
        <Text style={[styles.statusText, { color: statusStyle.textColor }]}>{trustStatus.label}</Text>
      </View>
      <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>{trustStatus.helper}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.unverified}>Community report — unverified</Text>
        {onDelete ? (
          <TouchableOpacity onPress={() => onDelete(report.id)}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    padding: spacing.lg
  },
  expiredCard: {
    opacity: 0.78
  },
  title: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 17
  },
  location: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md
  },
  time: {
    color: colors.muted,
    fontSize: 12,
    marginTop: spacing.sm
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 9,
    marginTop: spacing.md
  },
  statusText: {
    fontWeight: "900",
    fontSize: 12
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  unverified: {
    color: colors.warning,
    fontWeight: "800",
    fontSize: 12,
    flex: 1
  },
  delete: {
    color: colors.danger,
    fontWeight: "800",
    fontSize: 12,
    paddingLeft: spacing.md
  }
});

export default ReportCard;
