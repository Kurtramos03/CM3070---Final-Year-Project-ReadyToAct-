import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, spacing } from "../styles/globalStyles";

const ChecklistRow = ({ item, completed, onToggle }) => (
  <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.85}>
    <View style={[styles.checkbox, completed && styles.checkboxDone]}>
      <Text style={styles.checkText}>{completed ? "✓" : ""}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    marginTop: 2
  },
  checkboxDone: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  checkText: {
    color: colors.white,
    fontWeight: "900"
  },
  title: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 15
  },
  description: {
    color: colors.muted,
    lineHeight: 19,
    fontSize: 13,
    marginTop: 4
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 6
  }
});

export default ChecklistRow;
