import { StyleSheet } from "react-native";

export const colors = {
  primary: "#0B4F6C",
  primaryDark: "#08384D",
  secondary: "#1B998B",
  accent: "#F4A261",
  danger: "#D62828",
  warning: "#F77F00",
  success: "#2A9D8F",
  info: "#457B9D",
  background: "#F5F7FA",
  card: "#FFFFFF",
  text: "#1D2733",
  muted: "#667085",
  lightMuted: "#F0F3F7",
  border: "#D9E2EC",
  white: "#FFFFFF"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const severityRank = {
  High: 3,
  Moderate: 2,
  Low: 1
};

export const getSeverityStyle = (severity) => {
  switch (severity) {
    case "High":
      return {
        backgroundColor: "#FEE2E2",
        borderColor: "#FCA5A5",
        textColor: colors.danger,
        dotColor: colors.danger
      };
    case "Moderate":
      return {
        backgroundColor: "#FEF3C7",
        borderColor: "#FCD34D",
        textColor: colors.warning,
        dotColor: colors.warning
      };
    default:
      return {
        backgroundColor: "#DCFCE7",
        borderColor: "#86EFAC",
        textColor: colors.success,
        dotColor: colors.success
      };
  }
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 110
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  compactCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  noticeCard: {
    backgroundColor: "#E0F2FE",
    borderColor: "#7DD3FC",
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  noticeText: {
    color: "#075985",
    fontSize: 13,
    lineHeight: 19
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm
  },
  buttonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15
  },
  secondaryButton: {
    backgroundColor: colors.lightMuted,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15
  },
  dangerButton: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm
  },
  dangerButtonText: {
    color: colors.danger,
    fontWeight: "800"
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.md
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13
  },
  chipTextActive: {
    color: colors.white
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start"
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800"
  },
  mutedText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19
  },
  smallText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17
  },
  bodyText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.lightMuted,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.secondary
  }
});
