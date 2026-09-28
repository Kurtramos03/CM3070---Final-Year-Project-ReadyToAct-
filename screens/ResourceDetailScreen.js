import React from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const ResourceDetailScreen = ({ route }) => {
  const resource = route?.params?.resource;

  if (!resource) {
    return (
      <View style={[globalStyles.screen, globalStyles.content]}>
        <Text style={globalStyles.title}>Resource not found</Text>
      </View>
    );
  }

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("[ReadyToAct] Unable to open resource link:", error?.message || error);
    }
  };

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <View style={globalStyles.card}>
        <Text style={{ fontSize: 42 }}>{resource.icon}</Text>
        <Text style={globalStyles.title}>{resource.title}</Text>
        <Text style={globalStyles.subtitle}>{resource.summary}</Text>
        <Text style={{ color: colors.primary, fontWeight: "900" }}>{resource.category}</Text>
      </View>

      {resource.sections.map((section) => (
        <View key={section.heading} style={globalStyles.card}>
          <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.sm }}>{section.heading}</Text>
          <Text style={globalStyles.bodyText}>{section.body}</Text>
        </View>
      ))}

      {resource.links?.length > 0 ? (
        <View style={globalStyles.card}>
          <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.sm }}>Official references</Text>
          {resource.links.map((link) => (
            <TouchableOpacity key={link.url} style={globalStyles.secondaryButton} onPress={() => openLink(link.url)}>
              <Text style={globalStyles.secondaryButtonText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={globalStyles.noticeCard}>
        <Text style={globalStyles.noticeText}>
          ReadyToAct is not an official emergency service. Follow official instructions during real incidents.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ResourceDetailScreen;
