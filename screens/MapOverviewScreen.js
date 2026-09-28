import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MetricCard from "../components/MetricCard";
import { isAlertRelevantToArea } from "../data/areas";
import { simulatedAlerts } from "../data/alerts";
import { MAP_REGIONS } from "../data/mapRegions";
import { getOneTimeUserLocation } from "../services/locationService";
import { fetchAllLiveData } from "../services/weatherService";
import { getUserAreaPreference, saveUserArea } from "../storage/preferenceStorage";
import { getReports } from "../storage/reportStorage";
import { colors, getSeverityStyle, globalStyles, severityRank, spacing } from "../styles/globalStyles";
import { getReportTrustStatus } from "../utils/reportStatus";

const singaporeMapImage = require("../assets/singapore-realistic-map.png");

const normalise = (value = "") => String(value).toLowerCase().replace(/[-_]/g, " ").trim();

const isReportRelevantToArea = (report = {}, area = "Islandwide") => {
  if (!area || area === "Islandwide") {
    return true;
  }

  const selected = normalise(area);
  const reportArea = normalise(report.area || "");
  const reportLocation = normalise(report.location || "");
  const selectedWords = selected.split(" ").filter(Boolean);

  if (reportArea === selected || reportLocation.includes(selected)) {
    return true;
  }

  return selectedWords.some((word) => reportLocation.includes(word));
};

const getHighestSeverity = (alerts = [], reports = []) => {
  const alertSeverity = alerts.reduce((highest, alert) => {
    return Math.max(highest, severityRank[alert.severity] || 0);
  }, 0);

  const reportSeverity = reports.reduce((highest, report) => {
    return Math.max(highest, severityRank[report.severity] || 0);
  }, 0);

  const value = Math.max(alertSeverity, reportSeverity);

  if (value >= 3) return "High";
  if (value >= 2) return "Moderate";
  if (value >= 1) return "Low";
  return "None";
};

const getRegionTone = (severity) => {
  if (severity === "High") {
    return {
      backgroundColor: "rgba(254, 226, 226, 0.96)",
      borderColor: colors.danger,
      textColor: colors.danger,
      dotColor: colors.danger
    };
  }

  if (severity === "Moderate") {
    return {
      backgroundColor: "rgba(254, 243, 199, 0.96)",
      borderColor: colors.warning,
      textColor: colors.warning,
      dotColor: colors.warning
    };
  }

  if (severity === "Low") {
    return {
      backgroundColor: "rgba(220, 252, 231, 0.96)",
      borderColor: colors.success,
      textColor: colors.success,
      dotColor: colors.success
    };
  }

  return {
    backgroundColor: "rgba(248, 250, 252, 0.96)",
    borderColor: colors.border,
    textColor: colors.muted,
    dotColor: colors.border
  };
};

const MapLegendItem = ({ label, color, borderColor }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color, borderColor }]} />
    <Text style={globalStyles.smallText}>{label}</Text>
  </View>
);

const MapOverviewScreen = ({ navigation, refreshKey }) => {
  const [alerts, setAlerts] = useState(simulatedAlerts);
  const [reports, setReports] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const [userArea, setUserArea] = useState("Islandwide");
  const [areaSource, setAreaSource] = useState("Manual");
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Use GPS once to estimate your current Singapore region, or select a region manually.");
  const [selectedArea, setSelectedArea] = useState("Central");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const applyPreferenceToState = (preference) => {
    const savedArea = preference.area || "Islandwide";
    setUserArea(savedArea);
    setAreaSource(preference.source || "Manual");
    setLocationInfo(preference.locationInfo || null);
    setSelectedArea(savedArea && savedArea !== "Islandwide" ? savedArea : "Central");

    if (preference.source === "GPS" && preference.locationInfo) {
      setLocationStatus(`GPS last estimated your area as ${savedArea}. Use the button below to refresh it.`);
    }
  };

  const loadOverview = async (forceRefresh = false) => {
    setLoading(true);

    try {
      const [savedReports, preference, liveResults] = await Promise.all([
        getReports(),
        getUserAreaPreference(),
        fetchAllLiveData({ forceRefresh })
      ]);

      const liveAlerts = liveResults
        .filter((result) => result.status === "loaded" && result.generatedAlert)
        .map((result) => result.generatedAlert);

      setReports(savedReports);
      applyPreferenceToState(preference);
      setApiResults(liveResults);
      setAlerts([...liveAlerts, ...simulatedAlerts]);
      setLastChecked(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (error) {
      console.log("[ReadyToAct] Map overview live data loading failed:", error?.message || error);
      const [savedReports, preference] = await Promise.all([getReports(), getUserAreaPreference()]);
      setReports(savedReports);
      applyPreferenceToState(preference);
      setApiResults([]);
      setAlerts(simulatedAlerts);
      setLastChecked(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [refreshKey]);

  const regionSummaries = useMemo(() => {
    return MAP_REGIONS.map((region) => {
      const regionAlerts = alerts.filter((alert) => isAlertRelevantToArea(alert, region.area));
      const regionReports = reports
        .map((report) => ({ ...report, trustStatus: getReportTrustStatus(report) }))
        .filter((report) => !report.trustStatus.isExpired)
        .filter((report) => isReportRelevantToArea(report, region.area));
      const highestSeverity = getHighestSeverity(regionAlerts, regionReports);
      const loadedApiCount = apiResults.filter((result) => result.status === "loaded").length;

      return {
        ...region,
        alerts: regionAlerts,
        reports: regionReports,
        highestSeverity,
        loadedApiCount,
        isMyArea: userArea === region.area,
        isGpsArea: areaSource === "GPS" && locationInfo?.area === region.area
      };
    });
  }, [alerts, apiResults, reports, userArea, areaSource, locationInfo]);

  const selectedSummary = useMemo(() => {
    return regionSummaries.find((region) => region.area === selectedArea) || regionSummaries[0];
  }, [regionSummaries, selectedArea]);

  const islandwideAlerts = alerts.filter((alert) => alert.area === "Islandwide" || String(alert.location || "").toLowerCase().includes("islandwide"));
  const activeReports = reports.filter((report) => !getReportTrustStatus(report).isExpired);
  const loadedApiCount = apiResults.filter((result) => result.status === "loaded").length;

  const handleSaveMyArea = async () => {
    await saveUserArea(selectedArea, "Manual");
    setUserArea(selectedArea);
    setAreaSource("Manual");
    setLocationInfo(null);
    setLocationStatus(`${selectedArea} has been saved as My Area manually.`);
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setLocationStatus("Requesting one-time foreground location permission...");

    try {
      const detected = await getOneTimeUserLocation();
      await saveUserArea(detected.area, "GPS", detected);
      setUserArea(detected.area);
      setSelectedArea(detected.area);
      setAreaSource("GPS");
      setLocationInfo(detected);

      const accuracyText = detected.accuracy ? `Accuracy around ${Math.round(detected.accuracy)}m.` : "Accuracy unavailable.";
      const locationWarning = detected.insideSingapore ? "" : " The detected coordinates may be outside Singapore, so the nearest Singapore area was estimated.";
      setLocationStatus(`GPS estimated your area as ${detected.area}. ${accuracyText}${locationWarning}`);
    } catch (error) {
      setLocationStatus(error?.message || "Unable to detect your location. Please choose a region manually.");
    } finally {
      setLocating(false);
    }
  };

  const renderRegion = (region) => {
    const tone = getRegionTone(region.highestSeverity);
    const isSelected = selectedArea === region.area;
    const isMyArea = region.isMyArea;

    return (
      <TouchableOpacity
        key={region.area}
        activeOpacity={0.88}
        onPress={() => setSelectedArea(region.area)}
        style={[
          styles.regionMarker,
          {
            top: region.markerTop,
            left: region.markerLeft,
            backgroundColor: tone.backgroundColor,
            borderColor: isSelected ? colors.primary : tone.borderColor,
            borderWidth: isSelected ? 3 : 2
          }
        ]}
      >
        <View style={[styles.markerDot, { backgroundColor: tone.dotColor }]} />
        <Text style={[styles.regionLabel, { color: isSelected ? colors.primary : tone.textColor }]}>{region.shortLabel}</Text>
        <Text style={styles.regionMeta}>{region.alerts.length}A • {region.reports.length}R</Text>
        {isMyArea ? <Text style={styles.myAreaPill}>My Area</Text> : null}
        {region.isGpsArea ? <Text style={styles.gpsPill}>GPS</Text> : null}
      </TouchableOpacity>
    );
  };

  const selectedTone = getSeverityStyle(selectedSummary?.highestSeverity || "Low");

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <Text style={globalStyles.title}>Singapore Map</Text>
      <Text style={globalStyles.subtitle}>
        View a stylised Singapore map showing regional alert severity, live data availability, active community reports and one-time GPS personalisation.
      </Text>

      <View style={globalStyles.noticeCard}>
        <Text style={globalStyles.noticeText}>
          The map is an approximate region overview for project testing. GPS is optional and used only once to estimate My Area; the app does not continuously track users.
        </Text>
      </View>

      <View style={[globalStyles.row, { marginBottom: spacing.md }]}> 
        <MetricCard label="Live sources" value={`${loadedApiCount}/${apiResults.length || 4}`} helper="Loaded" />
        <MetricCard label="Active reports" value={activeReports.length} helper="Not expired" />
        <MetricCard label="My Area" value={userArea === "Islandwide" ? "All" : userArea} helper={areaSource} />
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.cardTitle}>Location personalisation</Text>
        <Text style={[globalStyles.smallText, { marginTop: spacing.sm }]}>{locationStatus}</Text>
        {locationInfo ? (
          <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>Lat {locationInfo.latitude.toFixed(4)}, Lng {locationInfo.longitude.toFixed(4)} • {locationInfo.source}</Text>
        ) : null}
        <TouchableOpacity style={globalStyles.button} onPress={handleUseCurrentLocation} disabled={locating}>
          <Text style={globalStyles.buttonText}>{locating ? "Detecting location..." : "Use current GPS area"}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.card}>
        <View style={globalStyles.spaceBetween}>
          <Text style={styles.cardTitle}>Singapore overview map</Text>
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
        <Text style={[globalStyles.smallText, { marginTop: spacing.xs }]}>Tap a region marker to view alerts and active reports for that area.</Text>

        <View style={styles.mapFrame}>
          <ImageBackground source={singaporeMapImage} style={styles.mapImage} imageStyle={styles.mapImageRadius} resizeMode="cover">
            <View style={styles.mapOverlay} />
            {regionSummaries.map(renderRegion)}
          </ImageBackground>
        </View>

        <View style={styles.mapInstructionCard}>
          <Text style={styles.mapInstructionTitle}>How to read the map</Text>
          <Text style={globalStyles.smallText}>Markers show region, alert count and active report count. The marker border indicates the highest local severity. A GPS tag shows the region estimated from one-time device location.</Text>
        </View>

        <View style={styles.legendRow}>
          <MapLegendItem label="High" color="#FEE2E2" borderColor={colors.danger} />
          <MapLegendItem label="Moderate" color="#FEF3C7" borderColor={colors.warning} />
          <MapLegendItem label="Low" color="#DCFCE7" borderColor={colors.success} />
          <MapLegendItem label="No local issue" color="#F8FAFC" borderColor={colors.border} />
        </View>

        <TouchableOpacity style={globalStyles.secondaryButton} onPress={() => loadOverview(true)} disabled={loading}>
          <Text style={globalStyles.secondaryButtonText}>{loading ? "Refreshing..." : "Refresh map overview"}</Text>
        </TouchableOpacity>
        {lastChecked ? <Text style={[globalStyles.smallText, { marginTop: spacing.sm }]}>Last checked: {lastChecked}</Text> : null}
      </View>

      {selectedSummary ? (
        <View style={globalStyles.card}>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.cardTitle}>{selectedSummary.area} overview</Text>
            <View style={[globalStyles.badge, { backgroundColor: selectedTone.backgroundColor, borderColor: selectedTone.borderColor }]}> 
              <Text style={[globalStyles.badgeText, { color: selectedTone.textColor }]}>{selectedSummary.highestSeverity}</Text>
            </View>
          </View>
          <Text style={[globalStyles.mutedText, { marginTop: spacing.sm }]}>{selectedSummary.helper}</Text>

          <View style={[globalStyles.row, { marginTop: spacing.md }]}> 
            <View style={[globalStyles.compactCard, { flex: 1, marginRight: spacing.sm }]}> 
              <Text style={globalStyles.smallText}>Relevant alerts</Text>
              <Text style={styles.summaryValue}>{selectedSummary.alerts.length}</Text>
            </View>
            <View style={[globalStyles.compactCard, { flex: 1, marginLeft: spacing.sm }]}> 
              <Text style={globalStyles.smallText}>Active reports</Text>
              <Text style={styles.summaryValue}>{selectedSummary.reports.length}</Text>
            </View>
          </View>

          {selectedSummary.alerts.slice(0, 3).map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={styles.detailRow}
              onPress={() => navigation.navigate("AlertDetail", { alert })}
              activeOpacity={0.85}
            >
              <Text style={styles.detailTitle}>{alert.title}</Text>
              <Text style={globalStyles.smallText}>{alert.severity} • {alert.hazardType} • {alert.sourceType}</Text>
            </TouchableOpacity>
          ))}

          {selectedSummary.alerts.length === 0 ? (
            <Text style={[globalStyles.smallText, { marginTop: spacing.md }]}>No alerts currently match this region.</Text>
          ) : null}

          {selectedSummary.reports.slice(0, 3).map((report) => (
            <View key={report.id} style={styles.detailRow}>
              <Text style={styles.detailTitle}>{report.type} at {report.location}</Text>
              <Text style={globalStyles.smallText}>{report.severity} • {report.trustStatus.label}</Text>
            </View>
          ))}

          <TouchableOpacity style={globalStyles.button} onPress={handleSaveMyArea}>
            <Text style={globalStyles.buttonText}>Set {selectedSummary.area} as My Area</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={globalStyles.card}>
        <Text style={styles.cardTitle}>Islandwide context</Text>
        <Text style={[globalStyles.mutedText, { marginTop: spacing.sm }]}>Islandwide alerts apply to all regions and are included in each area overview.</Text>
        {islandwideAlerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.detailRow}
            onPress={() => navigation.navigate("AlertDetail", { alert })}
            activeOpacity={0.85}
          >
            <Text style={styles.detailTitle}>{alert.title}</Text>
            <Text style={globalStyles.smallText}>{alert.severity} • {alert.hazardType}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  mapFrame: {
    marginTop: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    overflow: "hidden",
    backgroundColor: "#E0F2FE",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3
  },
  mapImage: {
    width: "100%",
    aspectRatio: 1.67
  },
  mapImageRadius: {
    borderRadius: 24
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.02)"
  },
  regionMarker: {
    position: "absolute",
    width: 58,
    minHeight: 52,
    marginLeft: -29,
    marginTop: -26,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },
  markerDot: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.white
  },
  regionLabel: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  regionMeta: {
    color: colors.text,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
    textAlign: "center"
  },
  myAreaPill: {
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 8,
    fontWeight: "900",
    overflow: "hidden"
  },
  gpsPill: {
    marginTop: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.success,
    color: colors.white,
    fontSize: 8,
    fontWeight: "900",
    overflow: "hidden"
  },
  mapInstructionCard: {
    marginTop: spacing.md,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border
  },
  mapInstructionTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
    marginBottom: spacing.xs
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginRight: 6
  },
  summaryValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4
  },
  detailRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  detailTitle: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 3
  }
});

export default MapOverviewScreen;
