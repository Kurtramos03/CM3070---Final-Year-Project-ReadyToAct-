import React, { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import ResourceCard from "../components/ResourceCard";
import { resources } from "../data/resources";
import { colors, globalStyles } from "../styles/globalStyles";

const categories = ["All", "Weather", "Flood", "SCDF dataset", "Preparedness", "Trust"];

const ResourceHubScreen = ({ navigation }) => {
  const [category, setCategory] = useState("All");

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => category === "All" || resource.category === category);
  }, [category]);

  const renderChip = (value) => {
    const selected = value === category;
    return (
      <TouchableOpacity
        key={value}
        style={[globalStyles.chip, selected && globalStyles.chipActive]}
        onPress={() => setCategory(value)}
      >
        <Text style={[globalStyles.chipText, selected && globalStyles.chipTextActive]}>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={globalStyles.screen}
      contentContainerStyle={globalStyles.content}
      data={filteredResources}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={globalStyles.title}>Resource Hub</Text>
          <Text style={globalStyles.subtitle}>
            Quick preparedness guidance and official dataset references for weather, flood risk, shelters, AEDs and trusted information use.
          </Text>
          <View style={globalStyles.noticeCard}>
            <Text style={globalStyles.noticeText}>
              These resources support preparedness learning. They should be checked against official instructions during actual emergencies.
            </Text>
          </View>
          <Text style={globalStyles.sectionTitle}>Filter resources</Text>
          <View style={globalStyles.chipRow}>{categories.map(renderChip)}</View>
        </View>
      }
      renderItem={({ item }) => (
        <ResourceCard resource={item} onPress={() => navigation.navigate("ResourceDetail", { resource: item })} />
      )}
    />
  );
};

export default ResourceHubScreen;
