import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../styles/globalStyles";

const tabs = [
  { key: "alerts", label: "Alerts", icon: "⚠️" },
  { key: "reports", label: "Reports", icon: "📍" },
  { key: "map", label: "Map", icon: "🗺️" },
  { key: "preparedness", label: "Prepare", icon: "✅" },
  { key: "resources", label: "Resources", icon: "📚" },
  { key: "profile", label: "Profile", icon: "🏅" }
];

const BottomNav = ({ activeTab, onChangeTab }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onChangeTab(tab.key)}
            activeOpacity={0.85}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 10,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 16
  },
  itemActive: {
    backgroundColor: "#E0F2FE"
  },
  icon: {
    fontSize: 16,
    marginBottom: 2
  },
  label: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.muted
  },
  labelActive: {
    color: colors.primary
  }
});

export default BottomNav;
