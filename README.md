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
├── .env.example
├── assets/
├── components/
├── data/
├── screens/
├── services/
├── storage/
├── utils/
└── tests/