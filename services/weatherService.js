export const API_ENDPOINTS = {
  rainfall: "https://api-open.data.gov.sg/v2/real-time/api/rainfall",
  floodAlerts: "https://api-open.data.gov.sg/v2/real-time/api/flood-alerts",
  twoHourForecast: "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast",
  lightning: "https://api-open.data.gov.sg/v2/real-time/api/weather?api=lightning"
};

export const RAINFALL_API_URL = API_ENDPOINTS.rainfall;

const DATA_GOV_API_KEY =
  typeof process !== "undefined" && process.env
    ? process.env.EXPO_PUBLIC_DATA_GOV_API_KEY
    : "";

export const isDataGovApiKeyConfigured = () => Boolean(DATA_GOV_API_KEY);

const getDataGovHeaders = () => {
  const headers = {
    Accept: "application/json"
  };

  if (DATA_GOV_API_KEY) {
    headers["x-api-key"] = DATA_GOV_API_KEY;
  }

  return headers;
};

const createApiError = async (label, response) => {
  let bodyText = "";

  try {
    bodyText = await response.text();
  } catch (error) {
    bodyText = "Unable to read response body";
  }

  const trimmed = bodyText ? bodyText.slice(0, 220) : "No response body returned";
  console.log(`[ReadyToAct] ${label} API response body:`, trimmed);

  const statusHint = response.status === 401 || response.status === 403
    ? "Access restricted. Try adding EXPO_PUBLIC_DATA_GOV_API_KEY in a .env file."
    : "Request failed.";

  const error = new Error(`${label} API returned status ${response.status}. ${statusHint}`);
  error.status = response.status;
  error.bodyText = trimmed;
  return error;
};

const LIVE_DATA_CACHE_MS = 5 * 60 * 1000;
let liveDataCache = null;

export const clearLiveDataCache = () => {
  liveDataCache = null;
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 6500) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const getLatestItem = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return items[items.length - 1];
};

const deepFindArrays = (input, predicate, results = []) => {
  if (!input || typeof input !== "object") {
    return results;
  }

  if (Array.isArray(input)) {
    if (input.some((item) => item && typeof item === "object" && predicate(item))) {
      results.push(input);
    }
    input.forEach((item) => deepFindArrays(item, predicate, results));
    return results;
  }

  Object.values(input).forEach((value) => deepFindArrays(value, predicate, results));
  return results;
};

const formatTime = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "Latest";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getRainfallRisk = (maxRainfall) => {
  if (maxRainfall >= 10) {
    return {
      severity: "High",
      title: "Live Rainfall Risk Indicator",
      shortDescription: "A weather station is showing intense rainfall. Check official sources before travelling.",
      action: "Avoid flood-prone routes, keep away from drains and canals, and monitor official updates."
    };
  }

  if (maxRainfall >= 2) {
    return {
      severity: "Moderate",
      title: "Live Rainfall Risk Indicator",
      shortDescription: "Some rainfall has been detected. Stay aware if travelling outdoors.",
      action: "Plan sheltered routes, allow extra travel time, and check official weather updates."
    };
  }

  return {
    severity: "Low",
    title: "Live Rainfall Risk Indicator",
    shortDescription: "Latest station readings do not indicate heavy rainfall at this moment.",
    action: "Continue to stay aware and check official updates if weather conditions change."
  };
};

const normaliseRainfallReadings = (json) => {
  const data = json?.data || json;
  const latestReading = getLatestItem(data?.readings) || getLatestItem(data?.items)?.readings || getLatestItem(json?.items)?.readings;
  const readings = Array.isArray(latestReading?.data)
    ? latestReading.data
    : Array.isArray(latestReading?.readings)
      ? latestReading.readings
      : Array.isArray(latestReading)
        ? latestReading
        : [];
  const timestamp = latestReading?.timestamp || data?.timestamp || getLatestItem(data?.items)?.timestamp || new Date().toISOString();

  const normalised = readings
    .map((reading) => ({
      stationId: reading.stationId || reading.station_id || reading.id || reading.station || "Unknown",
      value: toNumber(reading.value ?? reading.rainfall ?? reading.reading ?? 0)
    }))
    .filter((reading) => reading.value !== null);

  return { readings: normalised, timestamp };
};

export const fetchRainfallSummary = async () => {
  const checkedAt = new Date().toISOString();
  console.log("[ReadyToAct] Calling rainfall API:", API_ENDPOINTS.rainfall);
  console.log("[ReadyToAct] data.gov.sg API key configured:", isDataGovApiKeyConfigured() ? "yes" : "no");
  const response = await fetchWithTimeout(API_ENDPOINTS.rainfall, { headers: getDataGovHeaders() });
  console.log("[ReadyToAct] Rainfall API response status:", response.status);

  if (!response.ok) {
    throw await createApiError("Rainfall", response);
  }

  const json = await response.json();
  const { readings, timestamp } = normaliseRainfallReadings(json);

  if (readings.length === 0) {
    throw new Error("No rainfall readings were available from the API response");
  }

  const values = readings.map((reading) => reading.value);
  const maxRainfall = Math.max(...values);
  const averageRainfall = values.reduce((sum, value) => sum + value, 0) / values.length;
  const highestStation = readings.find((reading) => reading.value === maxRainfall);
  const risk = getRainfallRisk(maxRainfall);

  return {
    key: "rainfall",
    label: "Rainfall",
    source: "data.gov.sg rainfall API",
    apiUrl: API_ENDPOINTS.rainfall,
    checkedAt,
    timestamp,
    stationCount: readings.length,
    maxRainfall,
    averageRainfall,
    highestStation: highestStation?.stationId || "Unknown",
    status: "loaded",
    summaryText: `${maxRainfall.toFixed(1)} mm highest reading from ${readings.length} stations`,
    generatedAlert: {
      id: `api-rainfall-${timestamp}`,
      title: risk.title,
      hazardType: "Heavy Rain",
      severity: risk.severity,
      location: `Highest station reading: ${highestStation?.stationId || "Unknown"}`,
      area: "Islandwide",
      time: formatTime(timestamp),
      sourceType: "Live API Indicator",
      apiUrl: API_ENDPOINTS.rainfall,
      shortDescription: risk.shortDescription,
      description:
        "This indicator is generated by ReadyToAct from the latest available rainfall reading. It is an app-level risk indicator and should be checked against official guidance.",
      possibleImpact:
        maxRainfall >= 2
          ? "Wet surfaces, slower travel and possible localised water build-up depending on the area."
          : "No major rainfall-related disruption is indicated by the latest available reading.",
      action: risk.action
    }
  };
};

const extractForecasts = (json) => {
  const data = json?.data || json;
  const latestItem = getLatestItem(data?.items) || getLatestItem(json?.items) || data;
  const directForecasts = latestItem?.forecasts || data?.forecasts || [];
  const forecastArrays = Array.isArray(directForecasts) && directForecasts.length > 0
    ? [directForecasts]
    : deepFindArrays(json, (item) => "forecast" in item && ("area" in item || "name" in item));
  const forecasts = forecastArrays.flat().map((item) => ({
    area: item.area || item.name || item.location || "Singapore",
    forecast: item.forecast || item.value || "Unknown"
  }));
  const timestamp = latestItem?.timestamp || latestItem?.update_timestamp || data?.timestamp || new Date().toISOString();
  const validPeriod = latestItem?.valid_period || latestItem?.validPeriod || data?.valid_period;
  return { forecasts, timestamp, validPeriod };
};

export const fetchTwoHourForecastSummary = async () => {
  const checkedAt = new Date().toISOString();
  console.log("[ReadyToAct] Calling 2-hour weather forecast API:", API_ENDPOINTS.twoHourForecast);
  const response = await fetchWithTimeout(API_ENDPOINTS.twoHourForecast, { headers: getDataGovHeaders() });
  console.log("[ReadyToAct] 2-hour weather forecast API response status:", response.status);

  if (!response.ok) {
    throw await createApiError("2-hour weather forecast", response);
  }

  const json = await response.json();
  const { forecasts, timestamp, validPeriod } = extractForecasts(json);

  if (forecasts.length === 0) {
    throw new Error("No forecast areas were available from the API response");
  }

  const severeTerms = ["thundery", "heavy", "showers", "rain", "windy"];
  const affected = forecasts.filter((item) =>
    severeTerms.some((term) => String(item.forecast).toLowerCase().includes(term))
  );
  const sampleAreas = affected.slice(0, 3).map((item) => item.area).join(", ");
  const severity = affected.length >= 12 ? "Moderate" : "Low";
  const shortDescription = affected.length > 0
    ? `${affected.length} forecast area(s) mention rain, showers, thunder or windy conditions.`
    : "No rain or thunderstorm keywords were found in the latest 2-hour forecast.";

  return {
    key: "twoHourForecast",
    label: "2-hour Forecast",
    source: "data.gov.sg 2-hour weather forecast API",
    apiUrl: API_ENDPOINTS.twoHourForecast,
    checkedAt,
    timestamp,
    validPeriod,
    forecastCount: forecasts.length,
    affectedCount: affected.length,
    status: "loaded",
    summaryText: `${affected.length}/${forecasts.length} forecast areas flagged by app keywords`,
    generatedAlert: {
      id: `api-forecast-${timestamp}`,
      title: "Live 2-hour Weather Outlook",
      hazardType: "Weather Forecast",
      severity,
      location: affected.length > 0 ? sampleAreas || "Multiple forecast areas" : "Islandwide",
      area: "Islandwide",
      time: formatTime(timestamp),
      sourceType: "Live API Indicator",
      apiUrl: API_ENDPOINTS.twoHourForecast,
      shortDescription,
      description:
        "This indicator is generated from the latest 2-hour weather forecast data. It highlights areas with forecast terms related to rain, showers, thunder or wind for app-level awareness.",
      possibleImpact:
        affected.length > 0
          ? "Users travelling through affected areas may want to check official weather updates and plan sheltered routes."
          : "No significant short-term weather keyword was detected by the app-level scan.",
      action:
        affected.length > 0
          ? "Check official weather updates, bring rain protection, and allow more travel time where necessary."
          : "Continue to monitor updates if weather conditions change."
    }
  };
};

const extractFloodEvents = (json) => {
  const arrays = deepFindArrays(json, (item) => {
    const keys = Object.keys(item).join(" ").toLowerCase();
    return keys.includes("flood") || keys.includes("alert") || keys.includes("location") || keys.includes("message");
  });

  const flattened = arrays.flat().filter((item) => item && typeof item === "object");
  const events = flattened
    .map((item, index) => ({
      id: item.id || item.event_id || item.alertId || `flood-${index}`,
      location: item.location || item.area || item.road || item.place || item.name || item.location_name || "Singapore",
      message: item.message || item.description || item.alert || item.title || item.status || "Flood alert event reported by the API",
      severity: item.severity || item.alert_level || item.alertLevel || "Moderate",
      timestamp: item.timestamp || item.created_at || item.updated_at || item.time || json?.data?.timestamp || new Date().toISOString()
    }))
    .filter((item, index, self) => {
      const text = `${item.location}-${item.message}-${item.timestamp}`;
      return self.findIndex((other) => `${other.location}-${other.message}-${other.timestamp}` === text) === index;
    });

  return events.filter((item) => item.location !== "Singapore" || item.message !== "Flood alert event reported by the API");
};

export const fetchFloodAlertSummary = async () => {
  const checkedAt = new Date().toISOString();
  console.log("[ReadyToAct] Calling PUB flood alerts API:", API_ENDPOINTS.floodAlerts);
  const response = await fetchWithTimeout(API_ENDPOINTS.floodAlerts, { headers: getDataGovHeaders() });
  console.log("[ReadyToAct] PUB flood alerts API response status:", response.status);

  if (!response.ok) {
    throw await createApiError("PUB flood alerts", response);
  }

  const json = await response.json();
  const events = extractFloodEvents(json);
  const timestamp = events[0]?.timestamp || json?.data?.timestamp || new Date().toISOString();
  const activeEvents = events.length;

  return {
    key: "floodAlerts",
    label: "PUB Flood Alerts",
    source: "data.gov.sg PUB flood alerts API",
    apiUrl: API_ENDPOINTS.floodAlerts,
    checkedAt,
    timestamp,
    eventCount: activeEvents,
    events,
    status: "loaded",
    summaryText: activeEvents > 0 ? `${activeEvents} flood alert event(s) returned` : "No active flood alert events returned",
    generatedAlert: {
      id: `api-flood-${timestamp}`,
      title: activeEvents > 0 ? "Live PUB Flood Alert Monitor" : "PUB Flood Alert Monitor",
      hazardType: "Flood Alert",
      severity: activeEvents > 0 ? "High" : "Low",
      location: activeEvents > 0 ? events.slice(0, 2).map((event) => event.location).join(", ") : "Islandwide",
      area: "Islandwide",
      time: formatTime(timestamp),
      sourceType: "Live API Indicator",
      apiUrl: API_ENDPOINTS.floodAlerts,
      shortDescription:
        activeEvents > 0
          ? "PUB flood alert events were returned by the data source. Check official channels before travelling."
          : "No active flood alert events were returned by the PUB flood alert data source.",
      description:
        "This indicator is generated from PUB flood alert data available through data.gov.sg. Flood warning notices may not be included in this dataset, so users should still check official PUB channels.",
      possibleImpact:
        activeEvents > 0
          ? "Affected routes may experience ponding, flooding or travel disruption depending on the alert location."
          : "No active flood alert event was detected by this data source at the time checked.",
      action:
        activeEvents > 0
          ? "Avoid flooded locations, stay away from drains and canals, and check official PUB and myENV updates."
          : "Continue monitoring official sources during heavy rain, especially before travelling."
    }
  };
};

const extractLightningEvents = (json) => {
  const arrays = deepFindArrays(json, (item) => {
    const keys = Object.keys(item).join(" ").toLowerCase();
    return keys.includes("latitude") || keys.includes("longitude") || keys.includes("lightning") || keys.includes("type");
  });

  const events = arrays.flat().filter((item) => item && typeof item === "object").map((item, index) => ({
    id: item.id || `lightning-${index}`,
    type: item.type || item.lightning_type || item.category || "Lightning observation",
    latitude: item.latitude || item.lat || item.location?.latitude,
    longitude: item.longitude || item.lng || item.lon || item.location?.longitude,
    timestamp: item.timestamp || item.datetime || item.time || json?.data?.timestamp || new Date().toISOString()
  }));

  return events.filter((item) => item.latitude || item.longitude || String(item.type).toLowerCase().includes("lightning"));
};

export const fetchLightningSummary = async () => {
  const checkedAt = new Date().toISOString();
  console.log("[ReadyToAct] Calling lightning observation API:", API_ENDPOINTS.lightning);
  console.log("[ReadyToAct] Lightning endpoint uses unified weather API with api=lightning.");
  const response = await fetchWithTimeout(API_ENDPOINTS.lightning, { headers: getDataGovHeaders() });
  console.log("[ReadyToAct] Lightning observation API response status:", response.status);

  if (!response.ok) {
    throw await createApiError("Lightning observation", response);
  }

  const json = await response.json();
  const events = extractLightningEvents(json);
  const timestamp = events[0]?.timestamp || json?.data?.timestamp || new Date().toISOString();
  const eventCount = events.length;
  const severity = eventCount >= 20 ? "High" : eventCount > 0 ? "Moderate" : "Low";

  return {
    key: "lightning",
    label: "Lightning",
    source: "data.gov.sg lightning observation API",
    apiUrl: API_ENDPOINTS.lightning,
    checkedAt,
    timestamp,
    eventCount,
    status: "loaded",
    summaryText: `${eventCount} observation item(s) detected by parser`,
    generatedAlert: {
      id: `api-lightning-${timestamp}`,
      title: "Live Lightning Awareness Indicator",
      hazardType: "Lightning",
      severity,
      location: "Singapore",
      area: "Islandwide",
      time: formatTime(timestamp),
      sourceType: "Live API Indicator",
      apiUrl: API_ENDPOINTS.lightning,
      shortDescription:
        eventCount > 0
          ? "Lightning observation data was returned. Outdoor users should check official guidance and seek shelter if needed."
          : "No lightning observation items were detected by the app parser at the time checked.",
      description:
        "This indicator is generated from lightning observation data. It is intended for app-level awareness and must be checked against official weather guidance.",
      possibleImpact:
        eventCount > 0
          ? "Outdoor activity may be unsafe if thunderstorms or lightning are nearby."
          : "No lightning observation item was detected by the app parser at the time checked.",
      action:
        eventCount > 0
          ? "Move indoors or to sheltered areas, avoid open fields and exposed structures, and monitor official weather updates."
          : "Continue monitoring weather updates if thunderstorms are expected."
    }
  };
};

export const fetchAllLiveData = async ({ forceRefresh = false } = {}) => {
  const now = Date.now();

  if (!forceRefresh && liveDataCache && now - liveDataCache.cachedAt < LIVE_DATA_CACHE_MS) {
    console.log("[ReadyToAct] Using cached live data results to reduce repeated API calls.");
    return liveDataCache.results;
  }

  const requests = [
    { key: "rainfall", label: "Rainfall", task: fetchRainfallSummary },
    { key: "floodAlerts", label: "PUB Flood Alerts", task: fetchFloodAlertSummary },
    { key: "twoHourForecast", label: "2-hour Forecast", task: fetchTwoHourForecastSummary },
    { key: "lightning", label: "Lightning", task: fetchLightningSummary }
  ];

  const results = await Promise.allSettled(requests.map((item) => item.task()));

  const normalisedResults = results.map((result, index) => {
    const source = requests[index];
    if (result.status === "fulfilled") {
      return {
        ...result.value,
        cacheStatus: "fresh"
      };
    }

    console.log(`[ReadyToAct] ${source.label} API access restricted or unavailable. Fallback used:`, result.reason?.message || result.reason);
    const statusCode = result.reason?.status;
    const isRestricted = statusCode === 401 || statusCode === 403;

    return {
      key: source.key,
      label: source.label,
      source: isRestricted ? "Access restricted / fallback mode" : "Fallback mode",
      apiUrl: API_ENDPOINTS[source.key],
      checkedAt: new Date().toISOString(),
      status: isRestricted ? "restricted" : "failed",
      statusCode,
      cacheStatus: "fresh",
      summaryText: result.reason?.message || "Unable to load this data source"
    };
  });

  liveDataCache = {
    cachedAt: now,
    results: normalisedResults
  };

  return normalisedResults;
};
