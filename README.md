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
- [Data Seeding (Auto‑Import)](#data-seeding-auto‑import)
- [User Interface](#user-interface)
- [Sorting, Searching & Pagination](#sorting-searching--pagination)
- [Form Behavior & Validation](#form-behavior--validation)
- [Preview, Print & Export](#preview-print--export)
- [Group Booking](#group-booking)
- [Database Schema](#database-schema)
- [Dictionary & Mappings](#dictionary--mappings)
- [Auto‑Update](#auto‑update)
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
- **Table Sorting & Pagination** – Toggle ascending/descending order, choose page size (10/50/100/All), and navigate pages.
- **Live Search** – Filter records instantly by any field.
- **Historical Data Auto‑Import** – The app automatically loads existing tickets from a bundled Excel file on first launch.
- **Fully Offline** – No server, no internet, no external API.
- **Professional Alerts** – Uses SweetAlert2 for delete confirmations and version selection.
- **Automatic Update** – Checks GitHub releases and downloads new versions with a single click (optional manual check from the menu).

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
| Font                | Vazirmatn (variable weight)          |
| Date Picker         | @majidh1/jalalidatepicker            |
| Searchable Dropdowns| Select2 + jQuery                     |
| Alerts              | SweetAlert2                          |
| Image Export        | html2canvas                          |
| Excel Parsing       | xlsx                                 |
| Auto‑Update         | electron‑updater                     |
| Bundler             | esbuild (for renderer)               |

---

## Architecture

The project follows a **modular file structure** with separation of concerns:

```
parvazlog/
├── assets/             # Logo and static assets (fonts, icons)
├── data/               # Excel file for seeding (1404.xlsx)
├── src/
│   ├── main.ts         # Electron main process, window creation, IPC handlers, auto‑seed, auto‑updater, menu
│   ├── preload.ts      # Secure context bridge for IPC
│   ├── database.ts     # SQLite connection, table creation
│   ├── utils.ts        # Digit conversion, random generators
│   ├── dictionary.ts   # Cities, airports, airlines mappings
│   ├── seed.ts         # Standalone Excel import script (for development)
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
git clone https://github.com/ramangorgin/parvazlog.git
cd parvazlog
npm install
# The postinstall script automatically rebuilds native modules for Electron
npm run dev       # rebuild for current platform + start
```

### Data Seeding (development only)
```bash
npm run seed      # manual Excel import (optional, the app auto‑seeds on first run)
```

### Development
```bash
npm run build     # compile only
npm start         # build + launch (may need npm rebuild better-sqlite3 if switching platforms)
```

---

## Data Seeding (Auto‑Import)

The application **automatically imports** the Excel file `data/1404.xlsx` on the **first launch** when the database is empty.  
This happens transparently – no user action required. The file is bundled inside the app’s resources during packaging.

For development, a standalone script (`src/seed.ts`) can also be run manually with `npm run seed`. It performs the same cleaning steps:
- Leading/trailing dots and extra whitespace removal
- Splitting full Persian names into first/last name
- Parsing combined airline + flight number column using dictionary matching
- Mapping cities to default airports (Mehrabad for Tehran, etc.)
- Computing missing penalty and total price fields
- Generating random watcher and reference for each record

---

## User Interface

- **Right‑to‑left** Persian layout with Vazirmatn font.
- Header with logo and Persian title “پروازلاگ”.
- Main table with selectable rows, edit/delete/preview buttons.
- **Search bar, sort toggle, page size selector, and pagination controls** all in one row above the table.
- “ثبت بلیط جدید” button opens an inline form (not a modal).
- Form layout: **2 fields per row** on desktop, **1 per row** on mobile.
- Searchable dropdowns (Select2) for origin city, destination city, airline.
- Airport dropdowns are dynamically populated based on selected city (Tehran offers both Mehrabad and Imam Khomeini).
- Time input as two selects (hour and minute) with Persian digits.
- Ticket price field automatically inserts commas every 3 digits.
- Watcher and reference have auto‑generate buttons (circular arrow SVG icon).
- Passenger cards have beautiful styling with hover effects and clear margins.
- Application menu includes **File**, **View** (zoom, devtools), and **Help** (check for updates).

---

## Sorting, Searching & Pagination

The table supports:
- **Sort**: toggle between ascending (۱→۳۹۹) and descending (۳۹۹→۱) order.
- **Live search**: type in any part of the row (name, city, date, flight number) – the table filters instantly.
- **Page size**: choose ۱۰, ۵۰, ۱۰۰, or “همه” (all).
- **Pagination buttons**: previous/next page with current page indicator.

All controls are in a single responsive row and work together seamlessly.

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

## Auto‑Update

The app uses `electron‑updater` with a **public GitHub repository** as the update source.  
- On startup, the app silently checks for a new version.  
- If a newer version is found, a SweetAlert2 dialog offers to download it.  
- The user can also manually trigger the check from **Help → Check for Update**.  
- After downloading, the app prompts to restart and install the new version.  
- **The local database (`parvazlog.db`) is never touched during updates** – it lives in `%APPDATA%\parvazlog`.

To publish a new release:
1. Bump the version in `package.json`.
2. Commit and push.
3. Run `export GH_TOKEN="your_token" && npm run dist`.
4. Go to the GitHub Releases page and publish the draft.

---

## Build & Packaging

### Development Build
```bash
npm run build
npm start
```

### Packaging for Windows
The Windows target is a **portable executable** (single .exe file) – no installation required.  
```bash
npm run pack
```
The output will be `release/Parvazlog-1.0.0.exe`.

To create a new release on GitHub (auto‑update compatible):
```bash
export GH_TOKEN="your_github_token"
npm run dist
```

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
