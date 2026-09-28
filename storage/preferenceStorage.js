import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_AREA_KEY = "@readytoact/user_area";
const USER_AREA_SOURCE_KEY = "@readytoact/user_area_source";
const USER_AREA_LOCATION_KEY = "@readytoact/user_area_location";

export const getUserArea = async () => {
  try {
    const stored = await AsyncStorage.getItem(USER_AREA_KEY);
    return stored || "Islandwide";
  } catch (error) {
    console.warn("Unable to load user area preference", error);
    return "Islandwide";
  }
};

export const getUserAreaPreference = async () => {
  try {
    const [area, source, locationJson] = await Promise.all([
      AsyncStorage.getItem(USER_AREA_KEY),
      AsyncStorage.getItem(USER_AREA_SOURCE_KEY),
      AsyncStorage.getItem(USER_AREA_LOCATION_KEY)
    ]);

    return {
      area: area || "Islandwide",
      source: source || "Manual",
      locationInfo: locationJson ? JSON.parse(locationJson) : null
    };
  } catch (error) {
    console.warn("Unable to load user area preference details", error);
    return { area: "Islandwide", source: "Manual", locationInfo: null };
  }
};

export const saveUserArea = async (area, source = "Manual", locationInfo = null) => {
  await AsyncStorage.setItem(USER_AREA_KEY, area || "Islandwide");
  await AsyncStorage.setItem(USER_AREA_SOURCE_KEY, source || "Manual");

  if (locationInfo) {
    await AsyncStorage.setItem(USER_AREA_LOCATION_KEY, JSON.stringify(locationInfo));
  } else if (source !== "GPS") {
    await AsyncStorage.removeItem(USER_AREA_LOCATION_KEY);
  }
};

export const clearUserArea = async () => {
  await Promise.all([
    AsyncStorage.removeItem(USER_AREA_KEY),
    AsyncStorage.removeItem(USER_AREA_SOURCE_KEY),
    AsyncStorage.removeItem(USER_AREA_LOCATION_KEY)
  ]);
};
