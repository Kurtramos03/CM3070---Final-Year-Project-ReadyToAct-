import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const getLabel = (score) => {
  if (score >= 80) return "Strong readiness";
  if (score >= 50) return "Building readiness";
  return "Getting started";
};

const ReadinessBar = ({ score }) => {
  const safeScore = Math.max(0, Math.min(score || 0, 100));
  return (
    <View style={styles.card}>
      <View style={globalStyles.spaceBetween}>
        <Text style={styles.label}>Readiness score</Text>
        <Text style={styles.score}>{safeScore}/100</Text>
      </View>
      <View style={globalStyles.progressTrack}>
        <View style={[globalStyles.progressFill, { width: `${safeScore}%` }]} />
      </View>
      <Text style={styles.helper}>{getLabel(safeScore)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.lg,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: spacing.md
  },
  label: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: spacing.md
  },
  score: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: spacing.md
  },
  helper: {
    color: colors.muted,
    marginTop: spacing.sm,
    fontWeight: "700"
  }
});

export default ReadinessBar;
