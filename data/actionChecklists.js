const defaultChecklist = {
  title: "General safety action checklist",
  before: [
    "Check the latest official updates before making travel decisions.",
    "Keep important contacts and essential items easy to access."
  ],
  during: [
    "Avoid unsafe areas and do not take risks to inspect a hazard.",
    "Follow instructions from official agencies, building staff or transport operators."
  ],
  after: [
    "Review what happened and update your preparedness plan.",
    "Report hazards only when it is safe to do so."
  ]
};

const checklists = {
  "Heavy Rain": {
    title: "Heavy rain action checklist",
    before: [
      "Check rainfall and short-term weather updates before travelling.",
      "Plan sheltered routes and allow extra travel time."
    ],
    during: [
      "Avoid open drains, canals and low-lying areas.",
      "Use sheltered walkways and slow down on slippery paths."
    ],
    after: [
      "Check whether nearby paths or roads are still affected.",
      "Submit a community report only if it is safe to do so."
    ]
  },
  "Flood Alert": {
    title: "Flood alert action checklist",
    before: [
      "Check whether your route passes through low-lying or flood-prone areas.",
      "Prepare an alternative route before leaving."
    ],
    during: [
      "Do not walk, cycle or drive through floodwater.",
      "Move away from fast-moving water, drains and canals."
    ],
    after: [
      "Avoid affected areas until water has cleared and the area is safe.",
      "Update your route plan for future heavy rain events."
    ]
  },
  "Flood Risk": {
    title: "Flood risk action checklist",
    before: [
      "Check rainfall and flood-related updates before travelling.",
      "Identify a safer route that avoids low-lying roads or underpasses."
    ],
    during: [
      "Avoid floodwater even if it appears shallow.",
      "Stay away from drains and canals during heavy rain."
    ],
    after: [
      "Check whether the risk has reduced before continuing your journey.",
      "Record useful observations for future preparedness."
    ]
  },
  "Weather Forecast": {
    title: "Weather forecast action checklist",
    before: [
      "Review the forecast before outdoor activities or long journeys.",
      "Carry rain protection if showers or thunderstorms are expected."
    ],
    during: [
      "Choose sheltered routes and avoid exposed areas during bad weather.",
      "Monitor updates if conditions worsen."
    ],
    after: [
      "Update your travel plan if more bad weather is expected.",
      "Review whether your preparedness items were enough."
    ]
  },
  "Lightning": {
    title: "Lightning safety action checklist",
    before: [
      "Check lightning or thunderstorm conditions before outdoor sport or open-area activities.",
      "Identify nearby indoor shelter before continuing outdoor plans."
    ],
    during: [
      "Move indoors and avoid open fields, water bodies and tall isolated objects.",
      "Do not shelter directly under trees during lightning risk."
    ],
    after: [
      "Wait until conditions have clearly improved before resuming outdoor activity.",
      "Review whether future outdoor plans need weather checks."
    ]
  },
  "Severe Weather": {
    title: "Severe weather action checklist",
    before: [
      "Secure loose items and check for weather warnings before going out.",
      "Plan a sheltered route if strong wind or storms are possible."
    ],
    during: [
      "Stay away from trees, unstable structures and exposed open areas.",
      "Delay outdoor activities until conditions improve."
    ],
    after: [
      "Watch for fallen branches, slippery surfaces and blocked paths.",
      "Report dangerous obstructions to the relevant authority when safe."
    ]
  },
  "Tremor Awareness": {
    title: "Tremor awareness action checklist",
    before: [
      "Know safe spots away from windows, shelves and hanging objects.",
      "Review your building's emergency instructions."
    ],
    during: [
      "Stay calm and move away from windows or unstable objects.",
      "Avoid using lifts during shaking."
    ],
    after: [
      "Follow building or official instructions before leaving or re-entering areas.",
      "Check for hazards such as broken glass or fallen objects."
    ]
  },
  "Blocked Path": {
    title: "Blocked path action checklist",
    before: [
      "Check route updates if heavy rain or strong wind has affected the area.",
      "Prepare an alternative route for walking, cycling or commuting."
    ],
    during: [
      "Do not climb over fallen branches or unstable obstructions.",
      "Keep a safe distance from damaged trees or loose objects."
    ],
    after: [
      "Report the obstruction to the relevant authority when safe.",
      "Update others only with clear and accurate information."
    ]
  }
};

export const getActionChecklistForHazard = (hazardType) => {
  return checklists[hazardType] || defaultChecklist;
};
