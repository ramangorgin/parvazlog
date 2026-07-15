import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { initDatabase, getDb } from './database';
import { autoUpdater } from 'electron-updater';
import * as XLSX from 'xlsx';
import { toEnglishDigits, generateReference, generateWatcher } from './utils';
import { cityAirports, airlines } from './dictionary';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
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

// ---------- Helper: parse Excel time value (fraction or string) ----------
function parseExcelTime(value: any): string {
    if (value === undefined || value === null || value === '') return '';
    // If it's a number (Excel serial time as fraction of 24h)
    if (typeof value === 'number') {
        const totalMinutes = Math.round(value * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    // If it's a string, try to clean it
    const cleaned = String(value).trim();
    // Accept "HH:MM" or "H:MM" etc.
    const match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
        const h = parseInt(match[1]).toString().padStart(2, '0');
        const m = match[2];
        return `${h}:${m}`;
    }
    // Fallback: just return cleaned
    return cleaned;
}

app.whenReady().then(() => {
    initDatabase();
    createWindow();

    // Auto‑updater
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => mainWindow?.webContents.send('update-message', 'Checking...'));
    autoUpdater.on('update-available', (info) => mainWindow?.webContents.send('update-available', info));
    autoUpdater.on('update-not-available', () => mainWindow?.webContents.send('update-not-available'));
    autoUpdater.on('error', (err) => mainWindow?.webContents.send('update-error', err));
    autoUpdater.on('update-downloaded', () => mainWindow?.webContents.send('update-downloaded'));

    ipcMain.handle('start-download', () => autoUpdater.downloadUpdate());
    ipcMain.on('install-update', () => autoUpdater.quitAndInstall());

    // Database IPC (same as before)
    ipcMain.handle('db:getAllTickets', () =>
    getDb().prepare('SELECT * FROM tickets ORDER BY row_number ASC').all()
    );
    ipcMain.handle('db:getTicketById', (_, id: number) =>
    getDb().prepare('SELECT * FROM tickets WHERE id = ?').get(id)
    );
    ipcMain.handle('db:insertTicket', (_, ticket: any) => {
        const stmt = getDb().prepare(`INSERT INTO tickets (
            row_number, reference, watcher, first_name_persian, last_name_persian,
            first_name_english, last_name_english, origin_city, destination_city,
            origin_airport, destination_airport, flight_date, flight_time,
            ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        const info = stmt.run(
            ticket.row_number, ticket.reference, ticket.watcher,
            ticket.first_name_persian, ticket.last_name_persian,
            ticket.first_name_english, ticket.last_name_english,
            ticket.origin_city, ticket.destination_city,
            ticket.origin_airport, ticket.destination_airport,
            ticket.flight_date, ticket.flight_time,
            ticket.ticket_price, ticket.penalty_percent, ticket.total_price,
            ticket.max_baggage, ticket.airline, ticket.flight_number,
            ticket.group_id || null
        );
        return info.lastInsertRowid;
    });
    ipcMain.handle('db:updateTicket', (_, id: number, ticket: any) => {
        getDb().prepare(`UPDATE tickets SET
        row_number=?, reference=?, watcher=?, first_name_persian=?, last_name_persian=?,
        first_name_english=?, last_name_english=?, origin_city=?, destination_city=?,
        origin_airport=?, destination_airport=?, flight_date=?, flight_time=?,
        ticket_price=?, penalty_percent=?, total_price=?, max_baggage=?, airline=?,
        flight_number=?, group_id=? WHERE id=?`).run(
            ticket.row_number, ticket.reference, ticket.watcher,
            ticket.first_name_persian, ticket.last_name_persian,
            ticket.first_name_english, ticket.last_name_english,
            ticket.origin_city, ticket.destination_city,
            ticket.origin_airport, ticket.destination_airport,
            ticket.flight_date, ticket.flight_time,
            ticket.ticket_price, ticket.penalty_percent, ticket.total_price,
            ticket.max_baggage, ticket.airline, ticket.flight_number,
            ticket.group_id || null, id
        );
    });
    ipcMain.handle('db:deleteTicket', (_, id: number) =>
    getDb().prepare('DELETE FROM tickets WHERE id = ?').run(id)
    );
    ipcMain.handle('db:getMaxRowNumber', () => {
        const row: any = getDb().prepare('SELECT MAX(row_number) as max FROM tickets').get();
        return row?.max || 0;
    });
    ipcMain.handle('db:clearAll', () => {
        getDb().prepare('DELETE FROM tickets').run();
        return { success: true };
    });

    // Image save
    ipcMain.handle('save-image', async (_, dataUrl: string, defaultName: string) => {
        const { filePath } = await dialog.showSaveDialog({
            defaultPath: defaultName,
                filters: [{ name: 'PNG', extensions: ['png'] }],
        });
        if (filePath) {
            fs.writeFileSync(filePath, dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
            return filePath;
        }
        return null;
    });

    // ---------- Excel import ----------
    ipcMain.handle('import-excel', async () => {
        const { filePaths } = await dialog.showOpenDialog({
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
            properties: ['openFile']
        });
        if (!filePaths || filePaths.length === 0) return { success: false, message: 'No file selected' };
        const filePath = filePaths[0];

        try {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (rows.length < 2) return { success: false, message: 'File is empty' };

            const expectedCols = ['ردیف', 'نام و نام خانوادگی', 'مبدأ', 'مقصد', 'تاریخ پرواز', 'ساعت', 'مبلغ بلیط (ریال)', 'درصد جریمه', 'مبلغ کل (ریال)', 'ایرلاین و شماره پرواز'];
            let headerIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                const rowData = rows[i];
                if (!rowData) continue;
                const cells = rowData.map((c: any) => (c || '').toString().trim());
                const matchCount = expectedCols.filter(col => cells.includes(col)).length;
                if (matchCount >= 3) { headerIndex = i; break; }
            }
            if (headerIndex === -1) return { success: false, message: 'Header row not found' };

            const header: string[] = rows[headerIndex].map((h: any) => (h || '').trim());
            const col: Record<string, number> = {};
            header.forEach((h, idx) => { col[h] = idx; });

            const cleanString = (val: any) => (val || '').toString().trim().replace(/^\.+/, '').replace(/\.+$/, '').replace(/\s+/g, ' ').trim();
            const splitFullName = (fullName: string) => {
                const parts = fullName.trim().split(/\s+/);
                return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
            };
            const getDefaultAirport = (city: string) => {
                const normalized = city.replace(/[\u200c\u200d\s]/g, '').trim();
                const match = cityAirports.find(c => c.persianCity.replace(/[\u200c\u200d\s]/g, '').trim() === normalized);
                return match ? match.airportPersian : city;
            };
            const parseAirlineFlight = (raw: string) => {
                if (!raw) return { flightNumber: '', airlinePersian: '' };
                const parts = raw.trim().split(/\s+/);
                for (let i = parts.length - 1; i >= 0; i--) {
                    const candidate = parts.slice(i).join(' ');
                    if (airlines.some(a => a.persianName === candidate)) {
                        return { flightNumber: parts.slice(0, i).join(''), airlinePersian: candidate };
                    }
                }
                return { flightNumber: parts[0] || '', airlinePersian: parts[1] || 'نامشخص' };
            };

            const insert = getDb().prepare(`INSERT INTO tickets (
                row_number, reference, watcher, first_name_persian, last_name_persian,
                first_name_english, last_name_english, origin_city, destination_city,
                origin_airport, destination_airport, flight_date, flight_time,
                ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
            const insertMany = getDb().transaction((records: any[]) => {
                for (const rec of records) insert.run(rec);
            });

                const recordsToInsert: any[] = [];
                let rowCount = 0;

                for (let i = headerIndex + 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || row.length === 0) continue;
                    const fullName = cleanString(row[col['نام و نام خانوادگی']]);
                    const originCity = cleanString(row[col['مبدأ']]);
                    const destCity = cleanString(row[col['مقصد']]);
                    const flightDate = cleanString(row[col['تاریخ پرواز']]);
                    if (!fullName || !originCity || !destCity || !flightDate) continue;

                    const { firstName, lastName } = splitFullName(fullName);
                    const ticketPrice = parseInt(toEnglishDigits(cleanString(row[col['مبلغ بلیط (ریال)']] || '0'))) || 0;
                    // Penalty and total price are ignored (empty) – we set default 0 and compute total
                    const penalty = 0;
                    const totalPrice = ticketPrice;  // no penalty, so total = ticket price
                    const airlineFlightRaw = cleanString(row[col['ایرلاین و شماره پرواز']] || '');
                    const { flightNumber, airlinePersian } = parseAirlineFlight(airlineFlightRaw);
                    const timeRaw = row[col['ساعت']];  // could be number or string
                    const flightTime = parseExcelTime(timeRaw);

                    recordsToInsert.push([
                        rowCount + 1, generateReference(), generateWatcher(),
                                         firstName, lastName, '', '', originCity, destCity,
                                         getDefaultAirport(originCity), getDefaultAirport(destCity),
                                         flightDate, flightTime,
                                         ticketPrice, penalty, totalPrice, 20,
                                         airlinePersian, flightNumber, null
                    ]);
                    rowCount++;
                }

                if (recordsToInsert.length > 0) {
                    insertMany(recordsToInsert);
                    return { success: true, count: recordsToInsert.length };
                } else {
                    return { success: false, message: 'No valid rows found' };
                }
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    });

    // ---------- Excel export ----------
    ipcMain.handle('export-excel', async () => {
        const { filePath } = await dialog.showSaveDialog({
            filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
            defaultPath: 'parvazlog-export.xlsx'
        });
        if (!filePath) return { success: false };
        const tickets = getDb().prepare('SELECT * FROM tickets ORDER BY row_number ASC').all();
        const header = ['ردیف', 'نام', 'نام خانوادگی', 'مبدأ', 'مقصد', 'تاریخ پرواز', 'ساعت', 'مبلغ بلیط (ریال)', 'رفرنس', 'ناظر', 'ایرلاین', 'شماره پرواز'];
        const data = tickets.map((t: any) => [
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

    // Menu (keep basic functions but also we have buttons for import/export)
    const menuTemplate: Electron.MenuItemConstructorOptions[] = [
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
                         mainWindow?.webContents.send('update-message', 'Checking...');
                         const timeout = setTimeout(() => mainWindow?.webContents.send('update-not-available'), 3000);
                         autoUpdater.once('checking-for-update', () => clearTimeout(timeout));
                         autoUpdater.checkForUpdates();
                     }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
