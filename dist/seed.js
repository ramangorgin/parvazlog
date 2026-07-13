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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const utils_1 = require("./utils");
const dictionary_1 = require("./dictionary");
// ---------- Normalize a Persian string for matching ----------
function normalizePersian(str) {
    return str
        .replace(/[\u200c\u200d\s]/g, '') // remove ZWNJ, ZWJ, and all spaces
        .trim();
}
// ---------- Utility: clean a string cell ----------
function cleanString(val) {
    if (val === undefined || val === null)
        return '';
    return val
        .toString()
        .trim()
        .replace(/^\.+/, '')
        .replace(/\.+$/, '')
        .replace(/\s+/g, ' ')
        .trim();
}
// ---------- Determine user data path ----------
function getUserDataPath() {
    const appName = 'parvazlog';
    if (process.platform === 'win32') {
        return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), appName);
    }
    else if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', appName);
    }
    else {
        return path.join(os.homedir(), '.config', appName);
    }
}
const dbPath = path.join(getUserDataPath(), 'parvazlog.db');
console.log(`Using database at: ${dbPath}`);
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
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
console.log('Clearing old records...');
db.exec('DELETE FROM tickets');
console.log('Old records removed.');
// ---------- Helper functions ----------
function splitFullName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0)
        return { firstName: '', lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}
function getDefaultAirportForCity(persianCity) {
    const normalizedInput = normalizePersian(persianCity);
    const match = dictionary_1.cityAirports.find(c => normalizePersian(c.persianCity) === normalizedInput);
    if (!match) {
        console.warn(`City not found in dictionary: "${persianCity}", using city name as airport.`);
        return persianCity;
    }
    return match.airportPersian;
}
function parseAirlineAndFlight(raw) {
    if (!raw)
        return { flightNumber: '', airlinePersian: '' };
    const parts = raw.trim().split(/\s+/);
    if (parts.length === 0)
        return { flightNumber: '', airlinePersian: '' };
    let airline = '';
    let flightNumber = '';
    for (let i = parts.length - 1; i >= 0; i--) {
        const candidate = parts.slice(i).join(' ');
        const found = dictionary_1.airlines.find(a => a.persianName === candidate);
        if (found) {
            airline = candidate;
            flightNumber = parts.slice(0, i).join('');
            break;
        }
    }
    if (!airline) {
        if (parts.length === 1) {
            flightNumber = parts[0];
            airline = 'نامشخص';
        }
        else {
            airline = parts[parts.length - 1];
            flightNumber = parts.slice(0, -1).join('');
        }
    }
    return { flightNumber, airlinePersian: airline };
}
function mapAirlineToPersian(raw) {
    const found = dictionary_1.airlines.find(a => a.persianName === raw);
    return found ? found.persianName : raw;
}
// ---------- Read Excel file ----------
const excelPath = path.join(__dirname, '..', 'data', '1404.xlsx');
if (!fs.existsSync(excelPath)) {
    console.error(`Excel file not found: ${excelPath}`);
    process.exit(1);
}
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
if (rows.length < 2) {
    console.error('Excel file has no data rows.');
    process.exit(1);
}
const header = rows[0].map((h) => h.trim());
console.log('Header row:', header);
const col = {};
header.forEach((h, idx) => { col[h] = idx; });
const requiredCols = [
    'ردیف', 'نام و نام خانوادگی', 'مبدأ', 'مقصد',
    'تاریخ پرواز', 'ساعت', 'مبلغ بلیط (ریال)',
    'درصد جریمه', 'مبلغ کل (ریال)', 'ایرلاین و شماره پرواز'
];
for (const c of requiredCols) {
    if (col[c] === undefined) {
        console.error(`Missing column: ${c}`);
        process.exit(1);
    }
}
const insert = db.prepare(`
INSERT INTO tickets (
    row_number, reference, watcher,
    first_name_persian, last_name_persian,
    first_name_english, last_name_english,
    origin_city, destination_city,
    origin_airport, destination_airport,
    flight_date, flight_time,
    ticket_price, penalty_percent, total_price,
    max_baggage, airline, flight_number,
    group_id
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`);
const insertMany = db.transaction((records) => {
    for (const rec of records)
        insert.run(rec);
});
const recordsToInsert = [];
let rowCount = 0;
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0)
        continue;
    const rowNumberRaw = cleanString(row[col['ردیف']]);
    const fullName = cleanString(row[col['نام و نام خانوادگی']]);
    const originCityRaw = cleanString(row[col['مبدأ']]);
    const destCityRaw = cleanString(row[col['مقصد']]);
    const flightDateRaw = cleanString(row[col['تاریخ پرواز']]);
    const flightTimeRaw = cleanString(row[col['ساعت']]);
    const ticketPriceRaw = cleanString(row[col['مبلغ بلیط (ریال)']]);
    const penaltyRaw = cleanString(row[col['درصد جریمه']]);
    const totalPriceRaw = cleanString(row[col['مبلغ کل (ریال)']]);
    const airlineFlightRaw = cleanString(row[col['ایرلاین و شماره پرواز']]);
    if (!fullName || !originCityRaw || !destCityRaw || !flightDateRaw) {
        console.warn(`Skipping row ${i + 1}: missing essential fields.`);
        continue;
    }
    const { firstName, lastName } = splitFullName(fullName);
    const originCity = originCityRaw;
    const destCity = destCityRaw;
    const originAirport = getDefaultAirportForCity(originCity);
    const destAirport = getDefaultAirportForCity(destCity);
    const flightDate = flightDateRaw;
    const flightTime = flightTimeRaw.replace(/\./g, ':');
    const ticketPrice = parseInt((0, utils_1.toEnglishDigits)(ticketPriceRaw)) || 0;
    const penaltyPercent = parseInt((0, utils_1.toEnglishDigits)(penaltyRaw)) || 0;
    let totalPrice = parseInt((0, utils_1.toEnglishDigits)(totalPriceRaw)) || 0;
    if (!totalPriceRaw || totalPriceRaw === '') {
        totalPrice = Math.round(ticketPrice * (1 - penaltyPercent / 100));
    }
    const { flightNumber, airlinePersian } = parseAirlineAndFlight(airlineFlightRaw);
    const finalAirline = mapAirlineToPersian(airlinePersian);
    const maxBaggage = 20;
    const watcher = (0, utils_1.generateWatcher)();
    const reference = (0, utils_1.generateReference)();
    recordsToInsert.push([
        parseInt(rowNumberRaw) || rowCount + 1,
        reference,
        watcher,
        firstName,
        lastName,
        '', // first_name_english
        '', // last_name_english
        originCity,
        destCity,
        originAirport,
        destAirport,
        flightDate,
        flightTime,
        ticketPrice,
        penaltyPercent,
        totalPrice,
        maxBaggage,
        finalAirline,
        flightNumber,
        null
    ]);
    rowCount++;
}
if (recordsToInsert.length > 0) {
    insertMany(recordsToInsert);
    console.log(`Successfully seeded ${recordsToInsert.length} records.`);
}
else {
    console.log('No valid records found.');
}
db.close();
