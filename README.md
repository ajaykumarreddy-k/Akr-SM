# RailOne Mobile Web App UI Clone

An interactive, responsive mobile web application clone of the **RailOne / UTS Indian Railways** ticketing application built for UI design, prototyping, and educational portfolio purposes.

---

## ⚠️ Disclaimer & Legal Notice

> **IMPORTANT: FOR EDUCATIONAL & PORTFOLIO DEMONSTRATION PURPOSES ONLY**

1. **Non-Affiliation**: This project is an independent front-end UI demonstration and is **NOT** affiliated with, endorsed by, authorized by, or in any way officially connected to **Indian Railways**, **Centre for Railway Information Systems (CRIS)**, **IRCTC**, or any government body.
2. **No Commercial Use or Misuse**: This project is intended strictly as a technical showcase for front-end design, UI animations, state management, and component architecture.
3. **Limitation of Liability**: The developer/author of this repository accepts **no legal liability, responsibility, or obligation** for any misuse, unauthorized deployment, misrepresentation, or legal action arising from third-party usage of this open-source code.
4. **Disclaimer of Warranty**: The software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

---

## ✨ Features Included

- **Mobile Web Interface**: Custom responsive mobile frame container replicating official RailOne iOS & Android app UI aesthetics.
- **Mandatory Login Gate**: Simple mobile onboarding gate saving name & 10-digit mobile number to browser cache (`localStorage`).
- **UTS / PNR Ticket Booking**:
  - Unreserved, Reserved, and Platform ticket booking workflows.
  - Realistic UTS code pattern generator matching official Indian Railways formats (e.g. `XA3KEDB038`, `XA2OEDB1DB`).
  - Active ticket status windows with automatic browser storage persistence.
- **Real-Life Fare & Distance Calculation**:
  - Distance & fare engine matching official suburban slab rates (`0-15km: ₹5`, `16-30km: ₹10`, `31-50km: ₹15`).
  - Exact route matrix for popular Indian stations (`GUINDY`, `TAMBARAM`, `POTHERI`, `CHENNAI EGMORE`, `MGR CHENNAI CENTRAL`, `TIRUPATI`).
- **PDF Journey Invoice Export**:
  - Downloadable PDF invoice feature generating exact replicas of journey invoices matching official layout templates.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: TailwindCSS & Custom Glassmorphism CSS
- **Icons**: Lucide React & Custom Clean PNG Assets
- **PDF Generation**: `jsPDF` & `html2canvas`
- **Runtime**: Node.js / Bun

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) installed.

### Installation
```bash
# Clone repository
git clone https://github.com/ajaykumarreddy-k/Akr-SM.git

# Navigate into project directory
cd Akr-SM

# Install dependencies
npm install  # or: bun install
```

### Running Locally
```bash
# Start development server
npm run dev  # or: bun run dev
```
Open your browser at `http://localhost:3000` (or displayed port).

### Building for Production
```bash
npm run build  # or: bun run build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
# Akr-SM
