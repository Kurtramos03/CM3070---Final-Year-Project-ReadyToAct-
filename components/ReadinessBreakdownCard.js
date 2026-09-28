import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const ReadinessBreakdownCard = ({ readiness }) => {
  const items = readiness?.breakdown || [];

  return (
    <View style={globalStyles.card}>
      <Text style={styles.heading}>Readiness score breakdown</Text>
      <Text style={[globalStyles.mutedText, { marginTop: spacing.xs }]}>The score is calculated from preparedness actions, quiz learning, recent safe reporting and area personalisation.</Text>

      {items.map((item) => {
        const percent = item.maxPoints > 0 ? Math.round((item.points / item.maxPoints) * 100) : 0;
        return (
          <View key={item.key} style={styles.item}>
            <View style={globalStyles.spaceBetween}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.points}>{item.points}/{item.maxPoints}</Text>
            </View>
            <View style={[globalStyles.progressTrack, { marginTop: spacing.sm }]}> 
              <View style={[globalStyles.progressFill, { width: `${percent}%` }]} />
            </View>
            <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>{item.helper}</Text>
            <Text style={styles.nextAction}>{item.nextAction}</Text>
          </View>
        );
      })}

      <Text style={[globalStyles.mutedText, { marginTop: spacing.md }]}>This is a prototype engagement score and not an official emergency-readiness certification.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.md
  },
  itemLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
    paddingRight: spacing.sm
  },
  points: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  nextAction: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs
  }
});

export default ReadinessBreakdownCard;
