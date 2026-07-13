# Parvazlog

[![Electron](https://img.shields.io/badge/Electron-28.1.0-blue)](https://electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-brightgreen)](https://sqlite.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Parvazlog** is a fully offline desktop application built for Mr. Vala, a travel agency employee who previously used Excel to record domestic one‑way flight tickets.  
The app replaces error‑prone spreadsheets with a clean, Persian‑language UI, strong validation, and a local SQLite database – all without any internet connection or external backend.

---

## Table of Contents

- [Features](#features)
- [Business Logic](#business-logic)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Usage](#installation--usage)
- [Data Seeding from Excel](#data-seeding-from-excel)
- [User Interface](#user-interface)
- [Form Behavior & Validation](#form-behavior--validation)
- [Preview, Print & Export](#preview-print--export)
- [Group Booking](#group-booking)
- [Database Schema](#database-schema)
- [Dictionary & Mappings](#dictionary--mappings)
- [Build & Packaging](#build--packaging)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## Features

- **Full CRUD** – Create, read, update, and delete flight ticket records.
- **Persian UI** – Right‑to‑left interface with Persian digits shown everywhere.
- **Group Booking** – Enter shared flight details once and add multiple passengers.
- **Automatic Price Calculation** – Computes refundable amount (`total_price = ticket_price × (1 - penalty / 100)`).
- **Validation** – Numeric fields reject invalid characters; all inputs are normalised.
- **Digit Normalisation** – Persian digits in UI, English digits in database; English‑only output.
- **Searchable Selects** – Uses `Select2` for cities, airports, and airlines with search capability.
- **Auto‑generate** – One‑click random generation for reference code, watcher, and flight number.
- **Jalali Date Picker** – Persian calendar input with Persian digits.
- **Two Preview Modes** – *Full (agency)* and *Customer* version with proper field visibility.
- **Print & PNG Export** – Print single or multiple tickets; export each ticket as a separate PNG.
- **Historical Data Import** – One‑time seed script from an existing Excel file.
- **Fully Offline** – No server, no internet, no external API.
- **Professional Alerts** – Uses SweetAlert2 for delete confirmations and version selection.

---

## Business Logic

All flights are **domestic Iranian one‑way** tickets for **adult passengers**.

**Total price (refundable amount) formula:**
```
total_price = ticket_price × (1 - penalty_percentage / 100)
```

**Example:**  
Ticket price = 1,000,000 Rial, penalty = 70% → Refundable = 300,000 Rial.

**Output rules:**
- **Agency (full) version:** shows all fields including watcher, penalty, total price.
- **Customer version:** hides watcher, penalty, total price; shows ticket price and includes mandatory note:
  > *Passenger presence at the airport is mandatory at least 2 hours for domestic and 3 hours for international flights.*
- Both versions include a designated stamp/seal area and show passenger names in English with “Adult”.

---

## Tech Stack

| Layer               | Technology                          |
|---------------------|--------------------------------------|
| Framework           | Electron 28                          |
| Language            | TypeScript 5.3                       |
| Database            | SQLite via `better-sqlite3`          |
| UI Framework        | Bootstrap 5 (RTL)                    |
| Date Picker         | @majidh1/jalalidatepicker            |
| Searchable Dropdowns| Select2 + jQuery                     |
| Alerts              | SweetAlert2                          |
| Image Export        | html2canvas                          |
| Excel Parsing       | xlsx                                 |
| Bundler             | esbuild (for renderer)               |

---

## Architecture

The project follows a **modular file structure** with separation of concerns:

```
parvazlog/
├── assets/             # Logo and static assets
├── data/               # Excel file for seeding (1404.xlsx)
├── src/
│   ├── main.ts         # Electron main process, window creation, IPC handlers
│   ├── preload.ts      # Secure context bridge for IPC
│   ├── database.ts     # SQLite connection, table creation
│   ├── utils.ts        # Digit conversion, random generators
│   ├── dictionary.ts   # Cities, airports, airlines mappings
│   ├── seed.ts         # One‑time Excel import script
│   ├── renderer.ts     # All UI logic (bundled by esbuild)
│   ├── index.html      # HTML shell
│   └── style.css       # Custom styles
├── dist/               # Compiled output
├── package.json
└── tsconfig.json
```

**IPC Design:**  
All database operations run in the **main process** via Electron’s `ipcMain` handlers. The renderer communicates securely through a `preload.js` context bridge – no `nodeIntegration`, no direct database access from the UI.

**Build Process:**
1. TypeScript compiles Node‑side files (main, preload, database, utils, dictionary, seed).
2. esbuild bundles the renderer code with all its dependencies into a single `dist/renderer.js`.
3. Static assets (HTML, CSS, libraries, assets) are copied into `dist/`.

---

## Installation & Usage

### Prerequisites
- Node.js ≥ 18
- npm

### Setup
```bash
git clone https://github.com/yourusername/parvazlog.git
cd parvazlog
npm install
npm rebuild better-sqlite3   # ensure native module is compiled for Electron
npm run seed                 # import historical Excel data (optional)
npx electron-rebuild -f -w better-sqlite3
npm start
```

### Development
```bash
npm run build   # compile only
npm start       # build + launch
```

---

## Data Seeding from Excel

A script (`src/seed.ts`) reads `data/1404.xlsx` and imports all rows into the SQLite database.  
It handles:
- Leading/trailing dots and extra whitespace removal
- Splitting full Persian names into first/last name
- Parsing combined airline + flight number column using dictionary matching
- Mapping cities to default airports (Mehrabad for Tehran, etc.)
- Computing missing penalty and total price fields
- Generating random watcher and reference for each record

The seed script automatically clears existing records before importing to avoid duplicates.

---

## User Interface

- **Right‑to‑left** Persian layout.
- Header with logo and Persian title “پروازلاگ”.
- Main table with selectable rows, edit/delete/preview buttons.
- “ثبت بلیط جدید” button opens an inline form (not a modal).
- Form layout: **2 fields per row** on desktop, **1 per row** on mobile.
- Searchable dropdowns (Select2) for origin city, destination city, airline.
- Airport dropdowns are dynamically populated based on selected city (Tehran offers both Mehrabad and Imam Khomeini).
- Time input as two selects (hour and minute) with Persian digits.
- Ticket price field automatically inserts commas every 3 digits.
- Watcher and reference have auto‑generate buttons (circular arrow SVG icon).
- Passenger cards have beautiful styling with hover effects and clear margins.

---

## Form Behavior & Validation

- **All numeric fields** accept only digits (Persian or English) and auto‑convert to Persian digits on the fly.
- **Price field** formats with commas in Persian digits; stored as integer (English digits) in DB.
- **Total price** is recalculated instantly when ticket price or penalty changes.
- **Watcher** (8‑digit) and **reference** (6 alphanumeric) are flight‑level fields, not per‑passenger.
- **Default values:** max baggage = 20 kg, penalty = 0.
- **Group booking:** The form always shows one passenger by default; an “+ افزودن مسافر” button adds more. All passengers share the same flight data. Saving multiple passengers creates separate rows with a shared `group_id`.

---

## Preview, Print & Export

- Clicking **پیش‌نمایش** on a record (or selecting multiple rows and clicking the toolbar button) triggers a SweetAlert2 dialog to choose *Full* or *Customer* version.
- The preview modal displays all selected tickets (each on its own page via CSS `page-break-after`).
- **Print** – prints exactly what is shown in the modal.
- **Image Export** – uses `html2canvas` to capture each ticket individually and saves them as separate PNG files (naming pattern: `year.rowNumber.png`). A success alert shows the number of files saved.

---

## Group Booking

When the user adds more than one passenger in the new ticket form, the system:
- Generates a unique `group_id` (e.g., `GRP-1689000000-342`).
- Inserts multiple ticket records with the same `group_id` but consecutive row numbers.
- Future feature: allow editing all members of a group together (not in MVP).

---

## Database Schema

```sql
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  row_number INTEGER NOT NULL,
  reference TEXT NOT NULL,        -- 6-char alphanumeric
  watcher TEXT NOT NULL,          -- 8-digit number
  first_name_persian TEXT NOT NULL,
  last_name_persian TEXT NOT NULL,
  first_name_english TEXT NOT NULL,
  last_name_english TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  origin_airport TEXT NOT NULL,
  destination_airport TEXT NOT NULL,
  flight_date TEXT NOT NULL,      -- Jalali YYYY/MM/DD
  flight_time TEXT NOT NULL,      -- HH:MM
  ticket_price INTEGER NOT NULL,  -- Rial
  penalty_percent INTEGER NOT NULL DEFAULT 0,
  total_price INTEGER NOT NULL,   -- computed
  max_baggage INTEGER NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  group_id TEXT                   -- nullable, for group bookings
);
```

**Index:** `CREATE INDEX idx_group ON tickets(group_id);`

---

## Dictionary & Mappings

The file `src/dictionary.ts` contains seeded arrays of:

- **All Iranian cities** with commercial airports (50+ entries)
- **Airports** with Persian and English names (e.g., "شهید دستغیب" / "Shiraz International Airport")
- **Iranian airlines** (14 airlines with codes)

Helper functions map Persian names to English for preview output. All cities appear only once in the dropdown, even if they have multiple airports (e.g., Tehran).

---

## Build & Packaging

### Development Build
```bash
npm run build
npm start
```

### Packaging for Windows
```bash
npm install --save-dev electron-builder
# Add build config to package.json:
# "build": { "appId": "com.parvazlog.app", "directories": { "output": "dist-pack" }, "win": { "target": "nsis" } }
npx electron-builder --win
```
The `.exe` installer will be created in `dist-pack/`.

---

## Future Roadmap

- Voice‑based form filling
- Excel import/export UI
- Financial summaries (monthly/yearly sales)
- Batch editing for group bookings
- Automated transliteration of Persian names

---

## License

MIT © 2026 [Raman Gorgin Paveh]
