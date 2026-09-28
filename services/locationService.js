import * as Location from "expo-location";

export const SINGAPORE_BOUNDS = {
  minLatitude: 1.16,
  maxLatitude: 1.48,
  minLongitude: 103.58,
  maxLongitude: 104.10
};

export const AREA_CENTRES = [
  { area: "North", latitude: 1.43, longitude: 103.80, helper: "Woodlands / Yishun / Sembawang" },
  { area: "North East", latitude: 1.38, longitude: 103.90, helper: "Ang Mo Kio / Hougang / Punggol" },
  { area: "East", latitude: 1.34, longitude: 103.96, helper: "Tampines / Bedok / Changi" },
  { area: "Central", latitude: 1.31, longitude: 103.85, helper: "Orchard / Toa Payoh / CBD" },
  { area: "West", latitude: 1.35, longitude: 103.70, helper: "Jurong / Bukit Timah / Clementi" },
  { area: "South", latitude: 1.26, longitude: 103.82, helper: "HarbourFront / Sentosa / Marina" }
];

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export const isWithinSingaporeBounds = ({ latitude, longitude }) => {
  return (
    latitude >= SINGAPORE_BOUNDS.minLatitude &&
    latitude <= SINGAPORE_BOUNDS.maxLatitude &&
    longitude >= SINGAPORE_BOUNDS.minLongitude &&
    longitude <= SINGAPORE_BOUNDS.maxLongitude
  );
};

export const getNearestSingaporeArea = ({ latitude, longitude }) => {
  const ranked = AREA_CENTRES.map((region) => ({
    ...region,
    distanceKm: getDistanceKm(latitude, longitude, region.latitude, region.longitude)
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  return ranked[0] || AREA_CENTRES[3];
};

export const getOneTimeUserLocation = async () => {
  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    throw new Error("Location services are turned off on this device.");
  }

  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error("Location permission was not granted. You can still choose My Area manually.");
  }

  const lastKnown = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60 * 1000,
    requiredAccuracy: 2500
  });

  const location = lastKnown || await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced
  });

  const { latitude, longitude, accuracy } = location.coords;
  const nearestArea = getNearestSingaporeArea({ latitude, longitude });
  const insideSingapore = isWithinSingaporeBounds({ latitude, longitude });

  return {
    area: nearestArea.area,
    helper: nearestArea.helper,
    latitude,
    longitude,
    accuracy,
    insideSingapore,
    distanceKm: nearestArea.distanceKm,
    source: lastKnown ? "Last known device location" : "Current GPS/device location",
    checkedAt: new Date().toISOString()
  };
};
