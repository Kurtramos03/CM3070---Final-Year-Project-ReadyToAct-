export const USER_AREAS = [
  "Central",
  "North",
  "North East",
  "East",
  "West",
  "South",
  "Islandwide"
];

const normalise = (value = "") => String(value).toLowerCase().replace(/[-_]/g, " ").trim();

export const isAlertRelevantToArea = (alert = {}, selectedArea = "Islandwide") => {
  if (!selectedArea || selectedArea === "Islandwide") {
    return true;
  }

  const selected = normalise(selectedArea);
  const alertArea = normalise(alert.area || "");
  const location = normalise(alert.location || "");

  if (alertArea === "islandwide" || location.includes("islandwide")) {
    return true;
  }

  if (alertArea === selected || location.includes(selected)) {
    return true;
  }

  const selectedWords = selected.split(" ").filter(Boolean);
  return selectedWords.some((word) => location.includes(word));
};
