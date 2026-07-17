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
const XLSX = __importStar(require("xlsx"));
const utils_1 = require("./utils");
const dictionary_1 = require("./dictionary");
let mainWindow = null;
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
// ---------- Excel time parser ----------
function parseExcelTime(value) {
    if (value === undefined || value === null || value === '')
        return '';
    if (typeof value === 'number') {
        const totalMinutes = Math.round(value * 24 * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    const cleaned = String(value).trim();
    const match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
    if (match)
        return `${match[1].padStart(2, '0')}:${match[2]}`;
    return cleaned;
}
// ---------- Custom update check (GitHub API) ----------
async function checkForUpdates() {
    const request = electron_1.net.request({
        method: 'GET',
        url: 'https://api.github.com/repos/ramangorgin/parvazlog/releases/latest',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    request.on('response', (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
            try {
                const release = JSON.parse(data);
                const latestTag = release.tag_name.replace('v', '');
                const currentVersion = electron_1.app.getVersion();
                if (latestTag > currentVersion) {
                    const asset = release.assets.find((a) => a.name.endsWith('.exe'));
                    if (asset) {
                        mainWindow?.webContents.send('update-available', {
                            version: latestTag,
                            url: asset.browser_download_url,
                            size: asset.size
                        });
                    }
                    else {
                        mainWindow?.webContents.send('update-not-available');
                    }
                }
                else {
                    mainWindow?.webContents.send('update-not-available');
                }
            }
            catch (e) {
                mainWindow?.webContents.send('update-error', { message: 'Invalid response from GitHub' });
            }
        });
    });
    request.on('error', (err) => {
        mainWindow?.webContents.send('update-error', err);
    });
    request.end();
}
// ---------- Download update with progress ----------
async function downloadUpdate(url) {
    const win = electron_1.BrowserWindow.getFocusedWindow();
    if (!win)
        return;
    try {
        const { session } = win.webContents;
        const tempDir = electron_1.app.getPath('temp');
        const fileName = path.basename(url);
        const tempFilePath = path.join(tempDir, fileName);
        const request = electron_1.net.request(url);
        request.on('response', (response) => {
            const totalLength = parseInt(response.headers['content-length'] || '0', 10);
            let receivedLength = 0;
            const chunks = [];
            response.on('data', (chunk) => {
                receivedLength += chunk.length;
                chunks.push(chunk);
                if (totalLength > 0) {
                    const percent = Math.round((receivedLength / totalLength) * 100);
                    win.webContents.send('download-progress', percent);
                }
            });
            response.on('end', () => {
                const data = Buffer.concat(chunks);
                fs.writeFileSync(tempFilePath, data);
                const exePath = path.join(path.dirname(electron_1.app.getPath('exe')), 'Parvazlog.exe');
                fs.copyFileSync(tempFilePath, exePath);
                win.webContents.send('update-downloaded');
            });
            response.on('error', (err) => {
                win.webContents.send('update-error', err);
            });
        });
        request.end();
    }
    catch (err) {
        win.webContents.send('update-error', err);
    }
}
// ---------- App startup ----------
electron_1.app.whenReady().then(() => {
    (0, database_1.initDatabase)();
    createWindow();
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
    electron_1.ipcMain.handle('db:deleteMultipleTickets', (_, ids) => {
        const del = (0, database_1.getDb)().prepare('DELETE FROM tickets WHERE id = ?');
        const deleteMany = (0, database_1.getDb)().transaction((ids) => { for (const id of ids)
            del.run(id); });
        deleteMany(ids);
        return { success: true };
    });
    electron_1.ipcMain.handle('db:getMaxRowNumber', () => {
        const row = (0, database_1.getDb)().prepare('SELECT MAX(row_number) as max FROM tickets').get();
        return row?.max || 0;
    });
    electron_1.ipcMain.handle('db:clearAll', () => {
        (0, database_1.getDb)().prepare('DELETE FROM tickets').run();
        return { success: true };
    });
    // Image save
    electron_1.ipcMain.handle('save-image', async (_, dataUrl, defaultName, useDefaultPath = true) => {
        const config = getConfig();
        let filePath = null;
        if (useDefaultPath && config.exportPath) {
            filePath = path.join(config.exportPath, defaultName);
        }
        else {
            const { filePath: chosenPath } = await electron_1.dialog.showSaveDialog({
                defaultPath: defaultName,
                filters: [{ name: 'PNG', extensions: ['png'] }],
            });
            filePath = chosenPath || null;
        }
        if (filePath) {
            fs.writeFileSync(filePath, dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
            return filePath;
        }
        return null;
    });
    // ---------- Excel import ----------
    electron_1.ipcMain.handle('import-excel', async () => {
        const { filePaths } = await electron_1.dialog.showOpenDialog({
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
            properties: ['openFile']
        });
        if (!filePaths || filePaths.length === 0)
            return { success: false, message: 'No file selected' };
        const filePath = filePaths[0];
        try {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (rows.length < 2)
                return { success: false, message: 'File is empty' };
            const expectedCols = ['ردیف', 'نام و نام خانوادگی', 'مبدأ', 'مقصد', 'تاریخ پرواز', 'ساعت', 'مبلغ بلیط (ریال)', 'درصد جریمه', 'مبلغ کل (ریال)', 'ایرلاین', 'شماره پرواز'];
            let headerIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                const rowData = rows[i];
                if (!rowData)
                    continue;
                const cells = rowData.map((c) => (c || '').toString().trim());
                const matchCount = expectedCols.filter(col => cells.includes(col)).length;
                if (matchCount >= 3) {
                    headerIndex = i;
                    break;
                }
            }
            if (headerIndex === -1)
                return { success: false, message: 'Header row not found' };
            const header = rows[headerIndex].map((h) => (h || '').trim());
            const col = {};
            header.forEach((h, idx) => { col[h] = idx; });
            let maxRow = (0, database_1.getDb)().prepare('SELECT MAX(row_number) as max FROM tickets').get()?.max || 0;
            const cleanString = (val) => (val || '').toString().trim().replace(/^\.+/, '').replace(/\.+$/, '').replace(/\s+/g, ' ').trim();
            const splitFullName = (fullName) => {
                const parts = fullName.trim().split(/\s+/);
                return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
            };
            const getDefaultAirport = (city) => {
                const normalized = city.replace(/[\u200c\u200d\s]/g, '').trim();
                const match = dictionary_1.cityAirports.find(c => c.persianCity.replace(/[\u200c\u200d\s]/g, '').trim() === normalized);
                return match ? match.airportPersian : city;
            };
            const insert = (0, database_1.getDb)().prepare(`INSERT INTO tickets (row_number, reference, watcher, first_name_persian, last_name_persian, first_name_english, last_name_english, origin_city, destination_city, origin_airport, destination_airport, flight_date, flight_time, ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
            const insertMany = (0, database_1.getDb)().transaction((records) => { for (const rec of records)
                insert.run(rec); });
            const recordsToInsert = [];
            for (let i = headerIndex + 1; i < rows.length; i++) {
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
                const penalty = 0;
                const totalPrice = ticketPrice;
                const airlinePersian = cleanString(row[col['ایرلاین']] || '');
                const flightNumber = cleanString(row[col['شماره پرواز']] || '');
                if (airlinePersian && !dictionary_1.airlines.find(a => a.persianName === airlinePersian)) {
                    (0, dictionary_1.addAirline)(airlinePersian, airlinePersian, '');
                }
                const timeRaw = row[col['ساعت']];
                const flightTime = parseExcelTime(timeRaw);
                maxRow++;
                recordsToInsert.push([
                    maxRow, (0, utils_1.generateReference)(), (0, utils_1.generateWatcher)(),
                    firstName, lastName, '', '',
                    originCity, destCity,
                    getDefaultAirport(originCity), getDefaultAirport(destCity),
                    flightDate, flightTime,
                    ticketPrice, penalty, totalPrice, 20,
                    airlinePersian, flightNumber, null
                ]);
            }
            if (recordsToInsert.length > 0) {
                insertMany(recordsToInsert);
                return { success: true, count: recordsToInsert.length };
            }
            else {
                return { success: false, message: 'No valid rows found' };
            }
        }
        catch (err) {
            return { success: false, message: err.message };
        }
    });
    // Excel export
    electron_1.ipcMain.handle('export-excel', async () => {
        const { filePath } = await electron_1.dialog.showSaveDialog({
            filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
            defaultPath: 'parvazlog-export.xlsx'
        });
        if (!filePath)
            return { success: false };
        const tickets = (0, database_1.getDb)().prepare('SELECT * FROM tickets ORDER BY row_number ASC').all();
        const header = ['ردیف', 'نام', 'نام خانوادگی', 'مبدأ', 'مقصد', 'تاریخ پرواز', 'ساعت', 'مبلغ بلیط (ریال)', 'رفرنس', 'ناظر', 'ایرلاین', 'شماره پرواز'];
        const data = tickets.map((t) => [
            t.row_number, t.first_name_persian, t.last_name_persian,
            t.origin_city, t.destination_city, t.flight_date, t.flight_time,
            t.ticket_price, t.reference, t.watcher,
            t.airline, t.flight_number
        ]);
        const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Tickets');
        XLSX.writeFile(workbook, filePath);
        return { success: true };
    });
    // Update IPC
    electron_1.ipcMain.handle('check-update', () => checkForUpdates());
    electron_1.ipcMain.on('start-download', (_, url) => downloadUpdate(url));
    electron_1.ipcMain.on('install-update', () => {
        electron_1.app.relaunch();
        electron_1.app.exit();
    });
    // Menu
    const menuTemplate = [
        {
            label: 'File',
            submenu: [{ role: 'quit', label: 'Exit' }]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'resetZoom' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Check for Update',
                    click: () => {
                        mainWindow?.webContents.send('update-message', 'در حال بررسی...');
                        checkForUpdates();
                    }
                }
            ]
        }
    ];
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
// ---------- Export path config ----------
const configPath = path.join(electron_1.app.getPath('userData'), 'config.json');
function getConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }
    }
    catch (e) { }
    return { exportPath: '' };
}
function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
electron_1.ipcMain.handle('get-export-path', () => {
    return getConfig().exportPath;
});
electron_1.ipcMain.handle('set-export-path', async () => {
    const { filePaths } = await electron_1.dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select export folder'
    });
    if (filePaths && filePaths.length > 0) {
        const config = getConfig();
        config.exportPath = filePaths[0];
        saveConfig(config);
        return filePaths[0];
    }
    return null;
});
