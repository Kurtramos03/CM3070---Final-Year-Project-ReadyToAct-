# ReadyToAct

## Project Title

**ReadyToAct: A Singapore-Focused Mobile Application for Disaster Preparedness and Local Hazard Awareness**

## Project Template

**Template 10.1 — Developing a Mobile App for Local Disaster Preparedness and Response**

## Student

Kurt Ramos  
BSc Computer Science  
CM3070 Final-Year Project / CM3050 Mobile Development

---

## Overview

ReadyToAct is a Singapore-focused disaster preparedness and local hazard awareness mobile application built using React Native and Expo.

The app helps users access local hazard information, understand alert meaning, submit community observations, and improve preparedness through checklists, quizzes, resources, badges and a readiness score.

ReadyToAct is not an official emergency service. It is a final-year project prototype designed to support preparedness awareness and demonstrate mobile development techniques.

---

## Main Features

- Alerts dashboard
- Live public data indicators
- Simulated fallback alerts
- Rainfall, 2-hour weather forecast and lightning API integration
- PUB Flood Alerts integration attempt with restricted-source fallback handling
- Alert detail screen with recommended actions
- My Area personalisation
- One-time GPS area estimation
- Manual area selection
- Singapore regional map overview
- Community report submission
- Local report saving using AsyncStorage
- Report trust status and expiry logic
- Preparedness checklist
- Readiness quiz
- Resource Hub
- Profile readiness score
- Achievement badges
- Feedback form
- Basic logic tests for readiness score and report expiry

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile UI development |
| Expo | App development and testing |
| React Navigation | Tab and screen navigation |
| AsyncStorage | Local persistence for reports, preferences and progress |
| Expo Location | One-time GPS area estimation |
| data.gov.sg APIs | Rainfall, forecast, lightning and flood-alert data sources |
| JavaScript | App logic, services and utility functions |

---

## Project Structure

```text
readytoact/
├── App.js
├── app.json
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── .env.example
├── assets/
├── components/
├── data/
├── screens/
├── services/
├── storage/
├── styles/
├── utils/
└── tests/
```

---

## Prerequisites

Before running the project, install:

- Node.js
- npm
- Expo CLI through `npx`
- Expo Go, if running on a physical phone

You do not need to install `node_modules` manually. It will be created after running `npm install`.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Kurtramos03/CM3070---Final-Year-Project-ReadyToAct-.git
cd CM3070---Final-Year-Project-ReadyToAct-
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

---

## Running the Application

### Option 1: Run on Web

The web version is useful for quick testing and demonstration.

```bash
npx expo start --web
```

If web dependencies are missing, install them using:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

Then run again:

```bash
npx expo start --web
```

---

### Option 2: Run on Physical Phone

1. Install Expo Go on your phone.
2. Make sure your laptop and phone are on the same Wi-Fi network.
3. Run:

```bash
npx expo start
```

4. Scan the QR code using Expo Go.

---

## Optional API Key Setup

The app can run without an API key because it includes fallback handling.

To add an optional data.gov.sg API key:

1. Create a `.env` file in the project root.
2. Add the following line:

```env
EXPO_PUBLIC_DATA_GOV_API_KEY=your_api_key_here
```

3. Restart Expo:

```bash
npx expo start -c
```

Do not upload the real `.env` file to GitHub.

The repository includes `.env.example` only as a safe template.

---

## Testing

The project includes basic logic tests for:

- readiness score calculation;
- report expiry status.

Run the tests with:

```bash
npm run test
```

Expected output:

```text
Readiness score tests passed
Report status tests passed
```

## Evaluation Summary

ReadyToAct was evaluated using:

- functionality testing;
- API testing;
- GPS/location testing;
- logic testing;
- five-participant task-based user evaluation.

The user evaluation measured:

- task-completion rate;
- approximate time on task;
- observed errors;
- satisfaction ratings;
- qualitative feedback.

The main findings were:

- users were able to complete the main workflows;
- alert clarity and readiness motivation were rated strongly;
- trust-label wording needed improvement;
- GPS explanation should be clearer;
- the map should be explained as a regional overview rather than a precise GIS map.

---

## Disclaimer

ReadyToAct is a student final-year project prototype. It is not an official emergency service and should not replace official government alerts, emergency instructions or professional advice.
