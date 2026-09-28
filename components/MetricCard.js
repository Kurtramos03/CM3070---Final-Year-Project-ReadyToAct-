import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing } from "../styles/globalStyles";

const MetricCard = ({ label, value, helper }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
    {helper ? <Text style={styles.helper}>{helper}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primary
  },
  label: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "800",
    marginTop: 2
  },
  helper: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 3
  }
});

export default MetricCard;
