
````md
# Buyer Box Engine

A property intelligence and buyer-matching platform designed to help analyze land deals, evaluate risk, calculate offer potential, and match properties against buyer criteria through a step-by-step workflow.

## Overview

This system is built in milestones so each phase remains stable, scalable, and easy to improve over time.

The platform allows users to:

- Search for a property by address or APN
- Pull and display clean property data
- Run deal analysis and intelligence checks
- Evaluate risk and profit potential
- Match properties against buyer criteria
- Generate an AI-based verdict and deal tag

---

## Full System Flow

```text
Property Search
↓
Property Summary
↓
Property Intelligence / Deal Analysis
↓
Buyer Matching
↓
AI Verdict + Deal Tag
↓
Final Results on Dashboard
````

This structure makes it possible to build the platform step by step while ensuring every milestone connects properly into the next.

---

## Milestone 1 – Property Lookup Dashboard

This phase focuses on building the core dashboard where the user can search for a property and instantly view the property summary.

### Flow

```text
Enter Address / APN
↓
Send Request to n8n
↓
n8n Calls Regrid API
↓
Process / Clean Property Data
↓
Display Property Summary on Dashboard
↓
Optional: Save Property to Supabase
```

### Features

* Single dashboard UI
* Address / APN property search
* n8n webhook workflow
* Regrid API integration
* Clean property summary display
* Optional property save to Supabase
* Base structure prepared for future analysis and buyer matching

---

## Milestone 2 – Property Intelligence & Deal Logic

This phase makes the system intelligent by analyzing the property data and generating deal insights.

### Flow

```text
Use Property Data
↓
Run Utility Checks
↓
Run Flood Zone / HOA Checks
↓
Run Buildability Checks
↓
Pull Comparable Sales / Property History
↓
Calculate Offer Logic
↓
Run Risk Evaluation
↓
Generate Deal Score
↓
Display Analysis Results on Dashboard
```

### Features

* Utilities check (electric, water, sewer, septic via APIs)
* Flood zone check
* HOA status check
* Road access / buildability validation
* Comparable land sales
* Property history where available
* Basic offer calculation
* Risk evaluation
* Profit margin logic
* Final deal score displayed on dashboard

---

## Milestone 3 – Buyer Matching + Buyer Box Engine

This phase builds the matching engine that compares properties against buyer criteria and generates a clear verdict.

### Buyer Box Engine – Version 1 Flow

```text
Upload Image
↓
OCR Extraction
↓
Show Editable Criteria
↓
User Confirms
↓
Save Buyer (optional)
↓
Run Match Engine
↓
Generate Checklist
↓
Generate AI Verdict
↓
Assign Deal Tag
↓
Display Results
```

### Features

* Upload buyer box image
* OCR extraction of buyer criteria
* Editable criteria before matching
* User confirmation step for accuracy
* Optional save as reusable buyer profile
* Rule-based match engine
* Checklist output (pass / fail / partial)
* AI-generated summary / verdict
* Deal tag (Good Fit / Borderline / Not a Fit)
* Results displayed on dashboard

### Version 2 – Future Upgrade

* Improved OCR accuracy
* Weighted scoring / advanced matching logic
* Bulk matching across multiple properties
* Smarter AI insights and recommendations

---

## Core Capabilities

* Property lookup by address or APN
* Property data processing through n8n workflows
* Regrid API integration
* Optional Supabase storage
* Deal analysis and scoring
* Risk and profitability evaluation
* Buyer criteria extraction from image uploads
* Rule-based and AI-assisted matching workflow
* Clear dashboard-driven results

---

## Project Goal

The goal of this project is to create a streamlined system that helps users quickly:

1. Find a property
2. Understand its core details
3. Analyze whether it is a good deal
4. Match it against buyer requirements
5. Get a final verdict with confidence

---

## Future Expansion

Planned future improvements may include:

* More advanced scoring models
* Better OCR and extraction pipelines
* Bulk property analysis
* Expanded data source integrations
* Smarter AI recommendations
* Reusable buyer profiles and saved searches
* Enhanced reporting and export features

---

## Architecture Direction

The platform is designed around a modular workflow:

* **Frontend Dashboard** for user interaction
* **n8n Workflows** for automation and API orchestration
* **Regrid API** for property lookup
* **Additional APIs** for utilities, flood, HOA, comps, and history
* **Supabase** for optional data storage
* **AI Layer** for summaries, verdicts, and intelligent recommendations

This modular approach keeps the project flexible and easier to scale over time.

---

## Status

This project is being built in milestone phases to ensure stability, testing, and clear progress as each layer of the system is completed.

---

## 🚀 Vision & Future Direction

What we’re building right now (Version 1) is already a very solid foundation — it covers the full flow from property lookup → deal analysis → buyer matching 🔥  

But this is just the beginning.

The next phase (Version 2) is where the system evolves from a strong tool into something truly next-level and hard to compete with 🔥  

### 🔮 What’s Coming Next

- A smarter scoring system that doesn’t just check conditions, but weighs them like a real investor would 🔥  
- An AI deal advisor that explains *why* a deal is good or risky and suggests next steps 🔥  
- More advanced buyer matching with ranked results instead of just pass/fail  
- Stronger comps analysis with real pricing insights like price per acre and deal spread  
- Automation flows where deals can be analyzed and matched automatically 🔥  
- A more intelligent system that improves over time using AI models 🔥  

### 🧠 The Goal

This is where the platform starts to feel less like a tool and more like a **decision-making engine** 🔥  

---

### ⚠️ Development Approach

We are intentionally focusing on executing Version 1 cleanly before expanding further.

The priority is to ensure:
- Stability  
- Accuracy  
- Strong system foundation  

Once Version 1 is fully complete and validated, Version 2 will be introduced step by step with advanced AI models and enhanced intelligence layers.

---

### 💡 Philosophy

Build the foundation right → Then scale intelligence.

This approach ensures the system remains reliable, scalable, and truly top-tier.

## License

This project is proprietary unless otherwise specified.


