import React from "react";
import { ScrollView, Text, View } from "react-native";
import { getActionChecklistForHazard } from "../data/actionChecklists";
import { colors, getSeverityStyle, globalStyles, spacing } from "../styles/globalStyles";

const DetailBlock = ({ title, children }) => (
  <View style={globalStyles.card}>
    <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.sm }}>{title}</Text>
    <Text style={globalStyles.bodyText}>{children}</Text>
  </View>
);

const ChecklistSection = ({ title, items }) => (
  <View style={{ marginTop: spacing.md }}>
    <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.xs }}>{title}</Text>
    {items.map((item, index) => (
      <Text key={`${title}-${index}`} style={[globalStyles.bodyText, { marginBottom: spacing.xs }]}>• {item}</Text>
    ))}
  </View>
);

const AlertDetailScreen = ({ route }) => {
  const alert = route?.params?.alert;

  if (!alert) {
    return (
      <View style={[globalStyles.screen, globalStyles.content]}>
        <Text style={globalStyles.title}>Alert not found</Text>
        <Text style={globalStyles.subtitle}>Return to the dashboard and choose an alert again.</Text>
      </View>
    );
  }

  const severityStyle = getSeverityStyle(alert.severity);
  const actionChecklist = getActionChecklistForHazard(alert.hazardType);

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <View style={globalStyles.card}>
        <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.sm }}>{alert.sourceType}</Text>
        <Text style={globalStyles.title}>{alert.title}</Text>
        <Text style={globalStyles.subtitle}>{alert.shortDescription}</Text>
        <View style={[globalStyles.badge, { backgroundColor: severityStyle.backgroundColor, borderColor: severityStyle.borderColor }]}> 
          <Text style={[globalStyles.badgeText, { color: severityStyle.textColor }]}>{alert.severity} severity</Text>
        </View>
        {alert.myAreaRelevant ? (
          <View style={[globalStyles.badge, { backgroundColor: "#DBEAFE", borderColor: "#93C5FD", marginTop: spacing.sm }]}> 
            <Text style={[globalStyles.badgeText, { color: colors.primary }]}>Relevant to your My Area</Text>
          </View>
        ) : null}
      </View>

      <DetailBlock title="Hazard type">{alert.hazardType}</DetailBlock>
      <DetailBlock title="Location and time">{`${alert.location} • ${alert.time}`}</DetailBlock>
      {alert.apiUrl ? <DetailBlock title="API source endpoint">{alert.apiUrl}</DetailBlock> : null}
      <DetailBlock title="Description">{alert.description}</DetailBlock>
      <DetailBlock title="Possible impact">{alert.possibleImpact}</DetailBlock>

      <View style={[globalStyles.card, { borderColor: "#7DD3FC", backgroundColor: "#E0F2FE" }]}> 
        <Text style={{ color: "#075985", fontWeight: "900", marginBottom: spacing.sm }}>Recommended action</Text>
        <Text style={{ color: "#075985", fontSize: 15, lineHeight: 22 }}>{alert.action}</Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 17 }}>{actionChecklist.title}</Text>
        <Text style={[globalStyles.mutedText, { marginTop: spacing.xs }]}>A hazard-specific checklist links the alert to practical before, during and after actions.</Text>
        <ChecklistSection title="Before" items={actionChecklist.before} />
        <ChecklistSection title="During" items={actionChecklist.during} />
        <ChecklistSection title="After" items={actionChecklist.after} />
      </View>

      <View style={globalStyles.noticeCard}>
        <Text style={globalStyles.noticeText}>
          Safety note: ReadyToAct supports awareness and preparedness. Live API cards are app-level indicators, while simulated alerts are test data. Always verify urgent emergency information with official sources and follow official instructions.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AlertDetailScreen;
