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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const database_1 = require("./database");
const electron_updater_1 = require("electron-updater");
const XLSX = __importStar(require("xlsx"));
const utils_1 = require("./utils");
const dictionary_1 = require("./dictionary");
let mainWindow = null;
// ---------- Auto‑seed logic (runs only when DB is empty) ----------
function autoSeedIfEmpty() {
    const db = (0, database_1.getDb)();
    const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM tickets').get();
    if (countRow.cnt > 0) {
        console.log('Database already contains records, skipping auto‑seed.');
        return;
    }
    // Determine Excel path: in packaged app it's in resources/data, otherwise ../data
    const devPath = path.join(__dirname, '..', 'data', '1404.xlsx');
    const prodPath = path.join(process.resourcesPath, 'data', '1404.xlsx');
    const excelPath = fs.existsSync(prodPath) ? prodPath : (fs.existsSync(devPath) ? devPath : null);
    if (!excelPath) {
        console.warn('Seed file 1404.xlsx not found. Skipping auto‑seed.');
        return;
    }
    console.log('Auto‑seeding database from', excelPath);
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length < 2) {
        console.warn('Excel file has no data rows.');
        return;
    }
    // ---- Data cleaning helpers (same as in seed.ts) ----
    const cleanString = (val) => (val || '').toString().trim().replace(/^\.+/, '').replace(/\.+$/, '').replace(/\s+/g, ' ').trim();
    const normalizePersian = (str) => str.replace(/[\u200c\u200d\s]/g, '').trim();
    const splitFullName = (fullName) => {
        const parts = fullName.trim().split(/\s+/);
        return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
    };
    const getDefaultAirport = (city) => {
        const normalized = normalizePersian(city);
        const match = dictionary_1.cityAirports.find(c => normalizePersian(c.persianCity) === normalized);
        return match ? match.airportPersian : city;
    };
    const parseAirlineFlight = (raw) => {
        if (!raw)
            return { flightNumber: '', airlinePersian: '' };
        const parts = raw.trim().split(/\s+/);
        for (let i = parts.length - 1; i >= 0; i--) {
            const candidate = parts.slice(i).join(' ');
            if (dictionary_1.airlines.some(a => a.persianName === candidate)) {
                return { flightNumber: parts.slice(0, i).join(''), airlinePersian: candidate };
            }
        }
        return { flightNumber: parts[0] || '', airlinePersian: parts[1] || 'نامشخص' };
    };
    const header = rows[0].map((h) => h.trim());
    const col = {};
    header.forEach((h, idx) => { col[h] = idx; });
    const insert = db.prepare(`INSERT INTO tickets (
        row_number, reference, watcher, first_name_persian, last_name_persian,
        first_name_english, last_name_english, origin_city, destination_city,
        origin_airport, destination_airport, flight_date, flight_time,
        ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
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
        const fullName = cleanString(row[col['نام و نام خانوادگی']]);
        const originCity = cleanString(row[col['مبدأ']]);
        const destCity = cleanString(row[col['مقصد']]);
        const flightDate = cleanString(row[col['تاریخ پرواز']]);
        if (!fullName || !originCity || !destCity || !flightDate)
            continue;
        const { firstName, lastName } = splitFullName(fullName);
        const ticketPrice = parseInt((0, utils_1.toEnglishDigits)(cleanString(row[col['مبلغ بلیط (ریال)']] || '0'))) || 0;
        const penalty = parseInt((0, utils_1.toEnglishDigits)(cleanString(row[col['درصد جریمه']] || '0'))) || 0;
        let totalPrice = parseInt((0, utils_1.toEnglishDigits)(cleanString(row[col['مبلغ کل (ریال)']] || '0'))) || 0;
        if (!totalPrice)
            totalPrice = Math.round(ticketPrice * (1 - penalty / 100));
        const airlineFlightRaw = cleanString(row[col['ایرلاین و شماره پرواز']] || '');
        const { flightNumber, airlinePersian } = parseAirlineFlight(airlineFlightRaw);
        recordsToInsert.push([
            rowCount + 1, // row_number
            (0, utils_1.generateReference)(),
            (0, utils_1.generateWatcher)(),
            firstName,
            lastName,
            '', // first_name_english (empty – user will fill later)
            '', // last_name_english
            originCity,
            destCity,
            getDefaultAirport(originCity),
            getDefaultAirport(destCity),
            flightDate,
            cleanString(row[col['ساعت']] || ''),
            ticketPrice,
            penalty,
            totalPrice,
            20, // default max baggage
            airlinePersian,
            flightNumber,
            null // group_id
        ]);
        rowCount++;
    }
    if (recordsToInsert.length > 0) {
        insertMany(recordsToInsert);
        console.log(`Auto‑seeded ${recordsToInsert.length} records.`);
    }
}
// ---------- Window creation ----------
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'solid-logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.maximize();
    mainWindow.on('closed', () => { mainWindow = null; });
}
// ---------- App startup ----------
electron_1.app.whenReady().then(() => {
    (0, database_1.initDatabase)();
    autoSeedIfEmpty(); // ← auto‑seed runs here, before the window appears
    createWindow();
    // Auto‑updater
    electron_updater_1.autoUpdater.autoDownload = false;
    electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    electron_updater_1.autoUpdater.on('update-available', (info) => mainWindow?.webContents.send('update-available', info));
    electron_updater_1.autoUpdater.on('update-not-available', () => mainWindow?.webContents.send('update-not-available'));
    electron_updater_1.autoUpdater.on('update-downloaded', () => mainWindow?.webContents.send('update-downloaded'));
    electron_updater_1.autoUpdater.on('error', (err) => mainWindow?.webContents.send('update-error', err));
    electron_1.ipcMain.handle('start-download', () => electron_updater_1.autoUpdater.downloadUpdate());
    electron_1.ipcMain.on('install-update', () => electron_updater_1.autoUpdater.quitAndInstall());
    // Menu
    const menuTemplate = [{
            label: 'Help',
            submenu: [{ label: 'Check for Update', click: () => electron_updater_1.autoUpdater.checkForUpdates() }]
        }];
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menuTemplate));
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// ---------- Database IPC ----------
electron_1.ipcMain.handle('db:getAllTickets', () => (0, database_1.getDb)().prepare('SELECT * FROM tickets ORDER BY row_number ASC').all());
electron_1.ipcMain.handle('db:getTicketById', (_, id) => (0, database_1.getDb)().prepare('SELECT * FROM tickets WHERE id = ?').get(id));
electron_1.ipcMain.handle('db:insertTicket', (_, ticket) => {
    const stmt = (0, database_1.getDb)().prepare(`INSERT INTO tickets (
        row_number, reference, watcher, first_name_persian, last_name_persian,
        first_name_english, last_name_english, origin_city, destination_city,
        origin_airport, destination_airport, flight_date, flight_time,
        ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    const info = stmt.run(ticket.row_number, ticket.reference, ticket.watcher, ticket.first_name_persian, ticket.last_name_persian, ticket.first_name_english, ticket.last_name_english, ticket.origin_city, ticket.destination_city, ticket.origin_airport, ticket.destination_airport, ticket.flight_date, ticket.flight_time, ticket.ticket_price, ticket.penalty_percent, ticket.total_price, ticket.max_baggage, ticket.airline, ticket.flight_number, ticket.group_id || null);
    return info.lastInsertRowid;
});
electron_1.ipcMain.handle('db:updateTicket', (_, id, ticket) => {
    (0, database_1.getDb)().prepare(`UPDATE tickets SET
    row_number=?, reference=?, watcher=?, first_name_persian=?, last_name_persian=?,
    first_name_english=?, last_name_english=?, origin_city=?, destination_city=?,
    origin_airport=?, destination_airport=?, flight_date=?, flight_time=?,
    ticket_price=?, penalty_percent=?, total_price=?, max_baggage=?, airline=?,
    flight_number=?, group_id=? WHERE id=?`).run(ticket.row_number, ticket.reference, ticket.watcher, ticket.first_name_persian, ticket.last_name_persian, ticket.first_name_english, ticket.last_name_english, ticket.origin_city, ticket.destination_city, ticket.origin_airport, ticket.destination_airport, ticket.flight_date, ticket.flight_time, ticket.ticket_price, ticket.penalty_percent, ticket.total_price, ticket.max_baggage, ticket.airline, ticket.flight_number, ticket.group_id || null, id);
});
electron_1.ipcMain.handle('db:deleteTicket', (_, id) => (0, database_1.getDb)().prepare('DELETE FROM tickets WHERE id = ?').run(id));
electron_1.ipcMain.handle('db:getMaxRowNumber', () => {
    const row = (0, database_1.getDb)().prepare('SELECT MAX(row_number) as max FROM tickets').get();
    return row?.max || 0;
});
// Image save
electron_1.ipcMain.handle('save-image', async (_, dataUrl, defaultName) => {
    const { filePath } = await electron_1.dialog.showSaveDialog({
        defaultPath: defaultName,
        filters: [{ name: 'PNG', extensions: ['png'] }],
    });
    if (filePath) {
        fs.writeFileSync(filePath, dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
        return filePath;
    }
    return null;
});
