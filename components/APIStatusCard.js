import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const getStatusMeta = (status) => {
  if (status === "loaded") {
    return {
      label: "Loaded",
      pillStyle: styles.loaded,
      textStyle: styles.loadedText
    };
  }

  if (status === "restricted") {
    return {
      label: "Restricted",
      pillStyle: styles.restricted,
      textStyle: styles.restrictedText
    };
  }

  return {
    label: "Fallback",
    pillStyle: styles.failed,
    textStyle: styles.failedText
  };
};

const APIStatusCard = ({ item, onPress }) => {
  const statusMeta = getStatusMeta(item.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={globalStyles.spaceBetween}>
        <Text style={styles.title}>{item.label}</Text>
        <View style={[styles.statusPill, statusMeta.pillStyle]}>
          <Text style={[styles.statusText, statusMeta.textStyle]}>{statusMeta.label}</Text>
        </View>
      </View>
      <Text style={styles.summary}>{item.summaryText}</Text>
      <Text style={styles.source}>{item.source}</Text>
      {item.statusCode ? <Text style={styles.statusCode}>HTTP status: {item.statusCode}</Text> : null}
      <Text style={styles.endpoint} numberOfLines={1}>Endpoint: {item.apiUrl}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  title: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 14,
    flex: 1,
    paddingRight: spacing.sm
  },
  summary: {
    color: colors.text,
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 18
  },
  source: {
    color: colors.primary,
    fontWeight: "800",
    marginTop: spacing.sm,
    fontSize: 12
  },
  statusCode: {
    color: colors.warning,
    marginTop: 3,
    fontSize: 11,
    fontWeight: "800"
  },
  endpoint: {
    color: colors.muted,
    marginTop: 3,
    fontSize: 11
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1
  },
  loaded: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC"
  },
  restricted: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D"
  },
  failed: {
    backgroundColor: "#F1F5F9",
    borderColor: colors.border
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900"
  },
  loadedText: {
    color: colors.success
  },
  restrictedText: {
    color: colors.warning
  },
  failedText: {
    color: colors.muted
  }
});

export default APIStatusCard;
