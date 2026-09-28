import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, getSeverityStyle, globalStyles, spacing } from "../styles/globalStyles";

const AlertCard = ({ alert, onPress }) => {
  const severityStyle = getSeverityStyle(alert.severity);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={globalStyles.spaceBetween}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.hazard}>{alert.hazardType}</Text>
        </View>
        <View style={[globalStyles.badge, { backgroundColor: severityStyle.backgroundColor, borderColor: severityStyle.borderColor }]}>
          <Text style={[globalStyles.badgeText, { color: severityStyle.textColor }]}>{alert.severity}</Text>
        </View>
      </View>

      {alert.myAreaRelevant ? (
        <View style={styles.areaBadge}>
          <Text style={styles.areaBadgeText}>Relevant to your My Area</Text>
        </View>
      ) : null}

      <Text style={styles.description}>{alert.shortDescription}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>📍 {alert.location}</Text>
        <Text style={styles.meta}>🕒 {alert.time}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.source}>{alert.sourceType}</Text>
        <Text style={styles.viewMore}>View details →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    padding: spacing.lg
  },
  title: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 2
  },
  hazard: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md
  },
  metaRow: {
    marginTop: spacing.md,
    gap: 4
  },
  meta: {
    color: colors.muted,
    fontSize: 12
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md
  },
  source: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  viewMore: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12
  },
  areaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 9,
    marginTop: spacing.md
  },
  areaBadgeText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 11
  }
});

export default AlertCard;
