"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const XLSX = __importStar(require("xlsx"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
// This script runs standalone (outside Electron) using ts-node.
// It reads data/1404.xlsx and inserts into parvazlog.db in userData (same location as app).
// We'll create the db in the same place: %APPDATA%/parvazlog/parvazlog.db (or similar)
// For simplicity, we recreate the database path similar to Electron's userData.
// In electron userData is %APPDATA%/parvazlog, so:
const dbPath = path_1.default.join(process.env.APPDATA || '', 'parvazlog', 'parvazlog.db');
const db = new better_sqlite3_1.default(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    row_number INTEGER NOT NULL,
    reference TEXT NOT NULL,
    watcher TEXT NOT NULL,
    first_name_persian TEXT NOT NULL,
    last_name_persian TEXT NOT NULL,
    first_name_english TEXT NOT NULL,
    last_name_english TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    origin_airport TEXT NOT NULL,
    destination_airport TEXT NOT NULL,
    flight_date TEXT NOT NULL,
    flight_time TEXT NOT NULL,
    ticket_price INTEGER NOT NULL,
    penalty_percent INTEGER NOT NULL DEFAULT 0,
    total_price INTEGER NOT NULL,
    max_baggage INTEGER NOT NULL,
    airline TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    group_id TEXT
);
`);
const workbook = XLSX.readFile(path_1.default.join(__dirname, '..', 'data', '1404.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
// Assuming first row is header; actual data starts row 2
// Map columns: adjust indexes according to your Excel structure
// This is a template; you must match the exact columns from the provided Excel.
const insert = db.prepare(`
INSERT INTO tickets (row_number, reference, watcher, first_name_persian, last_name_persian, first_name_english, last_name_english, origin_city, destination_city, origin_airport, destination_airport, flight_date, flight_time, ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertMany = db.transaction((records) => {
    for (const rec of records) {
        insert.run(rec);
    }
});
const recordsToInsert = [];
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 19)
        continue; // skip incomplete
    // Convert string numbers to English and proper types
    const ticketPrice = parseInt((0, utils_1.toEnglishDigits)(String(row[12] || '0')));
    const penalty = parseInt((0, utils_1.toEnglishDigits)(String(row[13] || '0')));
    const totalPrice = parseInt((0, utils_1.toEnglishDigits)(String(row[14] || '0')));
    recordsToInsert.push([
        i, // row_number
        row[1], row[2],
        row[3], row[4], row[5], row[6],
        row[7], row[8], row[9], row[10],
        row[11], row[12],
        ticketPrice, penalty, totalPrice,
        parseInt((0, utils_1.toEnglishDigits)(String(row[15] || '0'))),
        row[17], row[18]
    ]);
}
insertMany(recordsToInsert);
console.log(`Seeded ${recordsToInsert.length} historical records.`);
db.close();
