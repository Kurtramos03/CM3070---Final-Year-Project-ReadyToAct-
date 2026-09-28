import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const ResourceCard = ({ resource, onPress }) => (
  <TouchableOpacity style={globalStyles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.row}>
      <Text style={styles.icon}>{resource.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.category}>{resource.category}</Text>
        <Text style={styles.summary}>{resource.summary}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.md
  },
  title: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 17
  },
  category: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
    marginTop: 2
  },
  summary: {
    color: colors.muted,
    lineHeight: 19,
    fontSize: 13,
    marginTop: 5
  },
  arrow: {
    color: colors.muted,
    fontSize: 28,
    paddingLeft: spacing.sm
  }
});

export default ResourceCard;
