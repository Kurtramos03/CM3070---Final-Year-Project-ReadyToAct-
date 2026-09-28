export const simulatedAlerts = [
  {
    id: "alert-001",
    title: "Heavy Rain Warning",
    hazardType: "Heavy Rain",
    severity: "High",
    location: "Central and South Singapore",
    area: "Central",
    time: "8:30 PM",
    sourceType: "Simulated Alert",
    shortDescription: "Persistent heavy rain may affect outdoor movement and low-lying areas.",
    description:
      "A simulated heavy rain warning has been created for testing the ReadyToAct alert workflow. Users should treat this as a controlled test alert, not a live official warning.",
    possibleImpact:
      "Possible slower travel, slippery walkways, reduced visibility and localised ponding in low-lying areas.",
    action:
      "Avoid unnecessary outdoor travel, check official weather updates, keep away from drains and canals, and choose sheltered routes where possible."
  },
  {
    id: "alert-002",
    title: "Flash Flood Risk Advisory",
    hazardType: "Flood Risk",
    severity: "Moderate",
    location: "Bukit Timah and Dunearn Road area",
    area: "West",
    time: "6:45 PM",
    sourceType: "Simulated Alert",
    shortDescription: "Low-lying roads may experience water build-up after intense rain.",
    description:
      "This simulated advisory represents a possible flash flood risk scenario following heavy rain. It is used to test how users read alert detail information and recommended actions.",
    possibleImpact:
      "Possible disruption to pedestrians, cyclists, private vehicles and buses in low-lying road sections.",
    action:
      "Avoid walking or driving through floodwater, follow official advice, and consider alternative routes if the area is affected."
  },
  {
    id: "alert-003",
    title: "Strong Wind Advisory",
    hazardType: "Severe Weather",
    severity: "Moderate",
    location: "North and East Singapore",
    area: "North East",
    time: "1:10 PM",
    sourceType: "Simulated Alert",
    shortDescription: "Strong winds may affect trees, temporary structures and outdoor activities.",
    description:
      "This simulated advisory is used to represent a severe weather scenario where strong wind conditions may affect outdoor safety.",
    possibleImpact:
      "Possible fallen branches, unstable loose objects, disrupted outdoor activities and increased travel caution.",
    action:
      "Stay away from trees during strong winds, secure loose items, and avoid exposed outdoor areas until conditions improve."
  },
  {
    id: "alert-004",
    title: "Regional Tremor Awareness Notice",
    hazardType: "Tremor Awareness",
    severity: "Low",
    location: "Islandwide",
    area: "Islandwide",
    time: "3:15 PM",
    sourceType: "Simulated Alert",
    shortDescription: "Users are reminded of basic safety actions if tremors are felt indoors.",
    description:
      "This simulated notice supports preparedness learning for regional tremor awareness. It is not an actual emergency alert.",
    possibleImpact:
      "Some users may feel mild shaking in tall buildings depending on regional seismic activity.",
    action:
      "Stay calm, move away from windows, avoid using lifts during shaking, and follow official building or safety instructions."
  },
  {
    id: "alert-005",
    title: "Fallen Branch Caution",
    hazardType: "Blocked Path",
    severity: "Low",
    location: "Park connector near Tampines",
    area: "East",
    time: "10:20 AM",
    sourceType: "Simulated Alert",
    shortDescription: "Fallen branches may obstruct a walking or cycling path after rain.",
    description:
      "This simulated caution supports testing of local hazard reporting and path obstruction information.",
    possibleImpact:
      "Pedestrians and cyclists may need to slow down or take a different route.",
    action:
      "Avoid the obstruction if present, do not attempt to remove heavy branches alone, and report dangerous obstructions to the relevant authority."
  }
];

export const hazardFilters = [
  "All",
  "Heavy Rain",
  "Flood Alert",
  "Flood Risk",
  "Weather Forecast",
  "Lightning",
  "Severe Weather",
  "Tremor Awareness",
  "Blocked Path"
];

export const severityFilters = ["All", "High", "Moderate", "Low"];
