import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import AlertCard from "../components/AlertCard";
import APIStatusCard from "../components/APIStatusCard";
import MetricCard from "../components/MetricCard";
import { USER_AREAS, isAlertRelevantToArea } from "../data/areas";
import { hazardFilters, severityFilters, simulatedAlerts } from "../data/alerts";
import { getOneTimeUserLocation } from "../services/locationService";
import { fetchAllLiveData, isDataGovApiKeyConfigured } from "../services/weatherService";
import { getUserAreaPreference, saveUserArea } from "../storage/preferenceStorage";
import { colors, globalStyles, severityRank, spacing } from "../styles/globalStyles";

const AlertDashboardScreen = ({ navigation, goToTab, refreshKey }) => {
  const [alerts, setAlerts] = useState(simulatedAlerts);
  const [apiStatus, setApiStatus] = useState("Loading live data sources...");
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [hazardFilter, setHazardFilter] = useState("All");
  const [userArea, setUserArea] = useState("Islandwide");
  const [areaSource, setAreaSource] = useState("Manual");
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Use GPS once to estimate your area, or choose it manually below.");
  const [locating, setLocating] = useState(false);
  const [showMyAreaOnly, setShowMyAreaOnly] = useState(false);

  const loadAreaPreference = async () => {
    const preference = await getUserAreaPreference();
    setUserArea(preference.area || "Islandwide");
    setAreaSource(preference.source || "Manual");
    setLocationInfo(preference.locationInfo || null);
  };

  const handleAreaChange = async (area) => {
    setUserArea(area);
    setAreaSource("Manual");
    setLocationInfo(null);
    setLocationStatus(`${area} has been saved as My Area manually.`);
    await saveUserArea(area, "Manual");
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setLocationStatus("Requesting one-time location permission...");

    try {
      const detected = await getOneTimeUserLocation();
      setUserArea(detected.area);
      setAreaSource("GPS");
      setLocationInfo(detected);
      await saveUserArea(detected.area, "GPS", detected);

      const accuracyText = detected.accuracy ? `Accuracy around ${Math.round(detected.accuracy)}m.` : "Accuracy unavailable.";
      const locationWarning = detected.insideSingapore ? "" : " The detected coordinates may be outside Singapore, so the nearest Singapore area was estimated.";
      setLocationStatus(`GPS estimated your area as ${detected.area}. ${accuracyText}${locationWarning}`);
    } catch (error) {
      setLocationStatus(error?.message || "Unable to detect your location. Please choose My Area manually.");
    } finally {
      setLocating(false);
    }
  };

  const loadLiveData = async (forceRefresh = false) => {
    setLoading(true);
    setApiStatus("Checking rainfall, flood alerts, 2-hour forecast and lightning data...");

    try {
      const results = await fetchAllLiveData({ forceRefresh });
      const liveAlerts = results
        .filter((result) => result.status === "loaded" && result.generatedAlert)
        .map((result) => result.generatedAlert);
      const loadedCount = results.filter((result) => result.status === "loaded").length;
      const restrictedCount = results.filter((result) => result.status === "restricted").length;

      setApiResults(results);
      setAlerts([...liveAlerts, ...simulatedAlerts]);
      setApiStatus(
        `${loadedCount}/${results.length} live data source(s) loaded${restrictedCount ? `, ${restrictedCount} restricted` : ""}. Simulated alerts remain available for fallback and controlled testing.`
      );
    } catch (error) {
      console.log("[ReadyToAct] Live data loading failed. Fallback used:", error?.message || error);
      setApiResults([]);
      setAlerts(simulatedAlerts);
      setApiStatus("Live data could not be loaded. The app is using simulated alerts as fallback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreaPreference();
    loadLiveData();
  }, [refreshKey]);

  const personalisedAlerts = useMemo(() => {
    return alerts.map((alert) => ({
      ...alert,
      myAreaRelevant: isAlertRelevantToArea(alert, userArea)
    }));
  }, [alerts, userArea]);

  const filteredAlerts = useMemo(() => {
    return personalisedAlerts
      .filter((alert) => severityFilter === "All" || alert.severity === severityFilter)
      .filter((alert) => hazardFilter === "All" || alert.hazardType === hazardFilter)
      .filter((alert) => !showMyAreaOnly || alert.myAreaRelevant)
      .sort((a, b) => {
        if (a.myAreaRelevant !== b.myAreaRelevant) {
          return a.myAreaRelevant ? -1 : 1;
        }
        return (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
      });
  }, [personalisedAlerts, severityFilter, hazardFilter, showMyAreaOnly]);

  const highCount = alerts.filter((alert) => alert.severity === "High").length;
  const moderateCount = alerts.filter((alert) => alert.severity === "Moderate").length;
  const myAreaCount = personalisedAlerts.filter((alert) => alert.myAreaRelevant).length;

  const renderChip = (value, selectedValue, onPress) => {
    const selected = value === selectedValue;
    return (
      <TouchableOpacity
        key={value}
        style={[globalStyles.chip, selected && globalStyles.chipActive]}
        onPress={() => onPress(value)}
      >
        <Text style={[globalStyles.chipText, selected && globalStyles.chipTextActive]}>{value}</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
      <Text style={globalStyles.title}>ReadyToAct</Text>
      <Text style={globalStyles.subtitle}>
        Singapore-focused disaster preparedness app for alerts, recommended actions, community reports and readiness learning.
      </Text>

      <View style={globalStyles.noticeCard}>
        <Text style={globalStyles.noticeText}>
          This app is a project prototype. Live data is used only for app-level awareness indicators. Simulated alerts remain available for testing and should not replace official emergency instructions.
        </Text>
      </View>

      <View style={[globalStyles.row, { marginBottom: spacing.md }]}> 
        <MetricCard label="High" value={highCount} helper="Priority" />
        <MetricCard label="Moderate" value={moderateCount} helper="Watch" />
        <MetricCard label="My Area" value={myAreaCount} helper={`${userArea} • ${areaSource}`} />
      </View>

      <TouchableOpacity style={globalStyles.secondaryButton} onPress={() => goToTab("map")}>
        <Text style={globalStyles.secondaryButtonText}>View Singapore map overview</Text>
      </TouchableOpacity>

      <View style={globalStyles.card}>
        <Text style={{ fontWeight: "900", color: colors.text, fontSize: 16 }}>My Area personalisation</Text>
        <Text style={[globalStyles.mutedText, { marginTop: spacing.sm }]}>Choose an area manually or use one-time GPS detection. ReadyToAct does not use continuous location tracking.</Text>
        <Text style={[globalStyles.smallText, { marginTop: spacing.sm }]}>{locationStatus}</Text>
        {locationInfo ? (
          <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>Saved from {locationInfo.source}. Lat {locationInfo.latitude.toFixed(4)}, Lng {locationInfo.longitude.toFixed(4)}.</Text>
        ) : null}
        <TouchableOpacity style={globalStyles.button} onPress={handleUseCurrentLocation} disabled={locating}>
          <Text style={globalStyles.buttonText}>{locating ? "Detecting location..." : "Use current GPS area"}</Text>
        </TouchableOpacity>
        <View style={[globalStyles.chipRow, { marginTop: spacing.md }]}>{USER_AREAS.map((area) => renderChip(area, userArea, handleAreaChange))}</View>
        <TouchableOpacity
          style={showMyAreaOnly ? globalStyles.button : globalStyles.secondaryButton}
          onPress={() => setShowMyAreaOnly((value) => !value)}
        >
          <Text style={showMyAreaOnly ? globalStyles.buttonText : globalStyles.secondaryButtonText}>
            {showMyAreaOnly ? "Showing My Area alerts only" : "Show My Area alerts only"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.card}>
        <View style={globalStyles.spaceBetween}>
          <Text style={{ fontWeight: "900", color: colors.text, fontSize: 16 }}>Live data verification</Text>
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
        <Text style={[globalStyles.mutedText, { marginTop: spacing.sm }]}>{apiStatus}</Text>
        <Text style={[globalStyles.smallText, { marginTop: spacing.sm }]}>API key configured: {isDataGovApiKeyConfigured() ? "Yes" : "No"}. Add EXPO_PUBLIC_DATA_GOV_API_KEY in .env if restricted sources remain blocked.</Text>
        <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>Open the browser console or Expo terminal to see each API endpoint, response status and fallback reason.</Text>

        <View style={{ marginTop: spacing.md }}>
          {apiResults.length > 0 ? (
            apiResults.map((item) => (
              <APIStatusCard
                key={item.key}
                item={item}
                onPress={() => item.generatedAlert && navigation.navigate("AlertDetail", { alert: item.generatedAlert })}
              />
            ))
          ) : (
            <Text style={globalStyles.smallText}>No live API result has loaded yet. Simulated alerts are shown below.</Text>
          )}
        </View>

        <TouchableOpacity style={globalStyles.secondaryButton} onPress={() => loadLiveData(true)} disabled={loading}>
          <Text style={globalStyles.secondaryButtonText}>{loading ? "Refreshing..." : "Refresh live data sources"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.sectionTitle}>Filter by severity</Text>
      <View style={globalStyles.chipRow}>{severityFilters.map((filter) => renderChip(filter, severityFilter, setSeverityFilter))}</View>

      <Text style={globalStyles.sectionTitle}>Filter by hazard type</Text>
      <View style={globalStyles.chipRow}>{hazardFilters.map((filter) => renderChip(filter, hazardFilter, setHazardFilter))}</View>

      <View style={globalStyles.spaceBetween}>
        <Text style={globalStyles.sectionTitle}>Current alerts</Text>
        <TouchableOpacity onPress={() => goToTab("reports")}>
          <Text style={{ color: colors.primary, fontWeight: "900" }}>Report issue</Text>
        </TouchableOpacity>
      </View>
      <Text style={[globalStyles.smallText, { marginBottom: spacing.sm }]}>Alerts relevant to {userArea} are prioritised and marked on the card.</Text>
    </View>
  );

  return (
    <FlatList
      style={globalStyles.screen}
      contentContainerStyle={globalStyles.content}
      data={filteredAlerts}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<ListHeader />}
      renderItem={({ item }) => (
        <AlertCard alert={item} onPress={() => navigation.navigate("AlertDetail", { alert: item })} />
      )}
      ListEmptyComponent={
        <View style={globalStyles.card}>
          <Text style={globalStyles.bodyText}>No alerts match the selected filters.</Text>
        </View>
      }
    />
  );
};

export default AlertDashboardScreen;
