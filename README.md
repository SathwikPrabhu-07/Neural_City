# Neural City × Road Safety Insights

An interactive civic-tech analytics platform that extends Neural City's **State of Indian Streets** dashboard by integrating real-world road accident outcomes from NCRB 2023 data.

## Live Demo

**Prototype:** https://neural-city-nu.vercel.app/

---
## Sample Screenshots from the hosted link
<img width="1263" height="743" alt="image" src="https://github.com/user-attachments/assets/b07daa8a-028d-4c30-abdd-3d7cccbe06cc" />
<img width="1157" height="846" alt="image" src="https://github.com/user-attachments/assets/1e5fd39f-c23a-4fb2-8136-8130c1ccd41d" />
<img width="1153" height="686" alt="image" src="https://github.com/user-attachments/assets/50789713-66cb-4a84-a13e-5877062ee740" />
<img width="1163" height="690" alt="image" src="https://github.com/user-attachments/assets/cc1d9928-1ca4-48ba-a1bf-965b479a0277" />


## Problem Statement

Neural City's dashboard measures how city streets look using AI-powered street intelligence metrics such as:

* Cleanliness
* Walkability
* Road Quality
* Dust Control
* Encroachment Control
* Aesthetics

These are valuable infrastructure indicators, but they do not answer an equally important question:

> Are these streets actually safe?

A city may score well visually while still experiencing a large number of road accidents and fatalities.

This project bridges that gap.

---

## Solution

Neural City × Road Safety Insights introduces a safety intelligence layer by combining:

### Neural City Metrics

Street quality and infrastructure scores

### NCRB Road Accident Data (2023)

* Cases Reported
* Persons Injured
* Persons Died
* Fatality Rate

The result is a unified platform that helps users understand:

* Which cities have strong infrastructure but poor safety outcomes
* Which cities perform well in both quality and safety
* Where the largest safety gaps exist

---

## Key Features

### Safety Leaderboard

Compare cities across:

* Neural City Score
* Total Accidents
* Total Deaths
* Total Injuries
* Fatality Rate
* Street Reality Index

---

### Safety Gap Analysis

Identify cities where:

* Street quality is relatively high
* Safety outcomes remain poor

This helps reveal hidden urban safety challenges.

---

### Street Reality Index (SRI)

A custom composite metric designed to evaluate cities using both:

* Infrastructure quality
* Road safety outcomes

The goal is to move beyond appearance and focus on real-world impact.

---

### Interactive Intelligence Map

Built using Leaflet and OpenStreetMap.

Features include:

* City-level markers
* Risk visualization
* Safety indicators
* Interactive city exploration
* Map-driven analytics

---

### Data Visualizations

Interactive charts provide insights into:

* Fatality trends
* Accident severity
* City comparisons
* Safety gaps
* Overall performance

---

## Dataset

### Primary Dataset

**National Crime Records Bureau (NCRB)**
Road Accident Statistics 2023

Source:
https://data.opencity.in/

Dataset includes:

* City-wise accident cases
* City-wise injuries
* City-wise fatalities

---

## Data Processing

The dataset was cleaned and transformed using the following steps:

1. Removed aggregate summary rows.
2. Standardized city names.
3. Mapped NCRB city names to Neural City city names.
4. Removed inconsistencies and duplicate entries.
5. Calculated derived metrics such as Fatality Rate.
6. Structured the data into a format suitable for dashboard visualization.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Styling

* Tailwind CSS

### Mapping

* Leaflet
* React Leaflet
* OpenStreetMap

### Charts

* Chart.js

### Deployment

* Vercel

---

## Project Structure

```text
src/
│
├── components/
│   ├── SafetyLeaderboard
│   ├── SafetyGapAnalysis
│   ├── StreetRealityIndex
│   ├── AnalyticsCharts
│   ├── IntelligenceMap
│   └── Methodology
│
├── data/
│   ├── accidents
│   └── cityMappings
│
├── utils/
│   ├── calculations
│   └── helpers
│
├── App.tsx
└── main.tsx
```

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd neural-city-road-safety-insights
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application will run on:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Why This Project Matters

Most urban dashboards focus on infrastructure quality.

Most accident reports focus only on safety statistics.

This project combines both perspectives.

Instead of asking:

> "How good do our streets look?"

it asks:

> "Do our streets actually produce safer outcomes for citizens?"

That shift from visual quality to real-world impact is the core motivation behind this project.

---

## Future Improvements

* Ward-level accident analysis
* Historical trend analysis
* Population-normalized safety metrics
* City boundary heatmaps
* Predictive risk modeling
* Real-time transportation and traffic datasets
* Additional civic datasets integration

---

## Acknowledgements

* Neural City
* National Crime Records Bureau (NCRB)
* OpenCity Data Platform
* OpenStreetMap Community

---

## Author

Sathwik Prabhu

Built as part of the Neural City Product Engineering Internship Assignment.
