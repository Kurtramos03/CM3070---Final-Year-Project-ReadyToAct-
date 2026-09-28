export const resources = [
  {
    id: "res-001",
    title: "Heavy Rain Safety",
    icon: "🌧️",
    category: "Weather",
    summary: "Simple steps to take before and during heavy rain.",
    sections: [
      {
        heading: "Before heavy rain",
        body: "Check weather updates, plan sheltered routes and avoid scheduling unnecessary outdoor activities during severe weather periods."
      },
      {
        heading: "During heavy rain",
        body: "Stay sheltered where possible, avoid exposed areas, move carefully on wet surfaces and monitor official updates."
      }
    ],
    links: [
      { label: "data.gov.sg rainfall API", url: "https://data.gov.sg/datasets/d_6580738cdd7db79374ed3152159fbd69/view" },
      { label: "2-hour weather forecast", url: "https://data.gov.sg/datasets/d_3f9e064e25005b0e42969944ccaf2e7a/view" }
    ]
  },
  {
    id: "res-002",
    title: "Flash Flood Safety",
    icon: "🌊",
    category: "Flood",
    summary: "Guidance for avoiding unsafe floodwater and low-lying areas.",
    sections: [
      {
        heading: "Avoid floodwater",
        body: "Do not walk, cycle or drive through floodwater. Water depth and current may be unsafe, and hazards may be hidden below the surface."
      },
      {
        heading: "Keep away from drains",
        body: "Stay away from drains, canals and fast-moving water during heavy rain or flash flood risk."
      }
    ],
    links: [
      { label: "PUB flood alerts dataset", url: "https://data.gov.sg/datasets/d_f1404e08587ce555b9ea3f565e2eb9a3/view" },
      { label: "PUB flood safety tips", url: "https://www.pub.gov.sg/" }
    ]
  },
  {
    id: "res-003",
    title: "Lightning and Thunderstorm Awareness",
    icon: "⚡",
    category: "Weather",
    summary: "Precautions when lightning or thunderstorms are observed.",
    sections: [
      {
        heading: "Outdoor safety",
        body: "Move indoors or to a sheltered area when thunderstorms or lightning are nearby. Avoid open fields, exposed structures, tall isolated trees and water bodies."
      },
      {
        heading: "Data limitation",
        body: "Lightning observations can support awareness, but users should still check official weather guidance and avoid relying on a single app indicator."
      }
    ],
    links: [
      { label: "data.gov.sg lightning observation", url: "https://data.gov.sg/datasets/d_08238953fe0f6dd13f10714ebfbcb9f9/view" }
    ]
  },
  {
    id: "res-004",
    title: "Strong Wind Safety",
    icon: "💨",
    category: "Weather",
    summary: "Precautions for strong winds, fallen branches and loose objects.",
    sections: [
      {
        heading: "Outdoor safety",
        body: "Avoid standing under trees or near loose structures during strong wind. Move indoors or to a safer sheltered area."
      },
      {
        heading: "At home",
        body: "Secure loose items such as plants, bicycles or outdoor furniture if it is safe to do so."
      }
    ]
  },
  {
    id: "res-005",
    title: "Civil Defence Public Shelters",
    icon: "🛡️",
    category: "SCDF dataset",
    summary: "Public shelter information that can support emergency preparedness awareness.",
    sections: [
      {
        heading: "How this supports ReadyToAct",
        body: "The final app can use shelter information as a preparedness resource. This is more suitable for the Resource Hub than the live Alerts tab because shelters are preparedness infrastructure rather than active hazard alerts."
      },
      {
        heading: "Implementation status",
        body: "This version includes the official dataset reference and a resource card. A future version can add searchable shelter records or map display if required."
      }
    ],
    links: [
      { label: "Civil Defence Public Shelters dataset", url: "https://data.gov.sg/datasets?agencies=Singapore+Civil+Defence+Force+%28SCDF%29&resultId=d_291795a678b8cf82f108780a6235ce18" }
    ]
  },
  {
    id: "res-006",
    title: "Public Access AEDs",
    icon: "❤️",
    category: "SCDF dataset",
    summary: "Public AED information that can support community emergency preparedness.",
    sections: [
      {
        heading: "How this supports ReadyToAct",
        body: "AED information is relevant to preparedness because users may need to know where emergency equipment is available. It also connects to SCDF myResponder as related work on public participation."
      },
      {
        heading: "Implementation status",
        body: "This version includes the official dataset reference and a resource card. A future version can add searchable AED locations or nearest-location features."
      }
    ],
    links: [
      { label: "Public Access AEDs dataset", url: "https://data.gov.sg/datasets/d_4e6b82c58a8a832f6f1fee5dfa6d47ea/view" }
    ]
  },
  {
    id: "res-007",
    title: "Tremor Awareness",
    icon: "🏢",
    category: "Preparedness",
    summary: "Basic actions if tremors are felt indoors.",
    sections: [
      {
        heading: "If shaking is felt",
        body: "Stay calm, move away from windows and shelves, and follow building safety instructions. Avoid using lifts during shaking."
      },
      {
        heading: "After shaking stops",
        body: "Check for official updates and report damage or injuries to the relevant authorities."
      }
    ]
  },
  {
    id: "res-008",
    title: "Official Sources and Trust",
    icon: "✅",
    category: "Trust",
    summary: "Reminder to verify emergency information using official channels.",
    sections: [
      {
        heading: "Check trusted sources",
        body: "Use official government, agency or emergency-service channels to verify weather, flood and safety information. ReadyToAct should support awareness, not replace official instructions."
      },
      {
        heading: "Community reports",
        body: "Treat community reports as local observations. They may be useful, but they should remain clearly separated from official information."
      }
    ],
    links: [
      { label: "data.gov.sg", url: "https://data.gov.sg" },
      { label: "SCDF myResponder", url: "https://www.scdf.gov.sg/home/community-and-volunteers/community-resources/myresponder-app" }
    ]
  }
];
