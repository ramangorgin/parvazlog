import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { initDatabase, getDb } from './database';
import { autoUpdater } from 'electron-updater';
import * as XLSX from 'xlsx';
import { toEnglishDigits, generateReference, generateWatcher } from './utils';
import { cityAirports, airlines } from './dictionary';

let mainWindow: BrowserWindow | null = null;

// ---------- Auto‑seed logic (runs only when DB is empty) ----------
function autoSeedIfEmpty() {
    const db = getDb();
    const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM tickets').get() as { cnt: number };
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
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length < 2) {
        console.warn('Excel file has no data rows.');
        return;
    }

    // ---- Data cleaning helpers ----
    const cleanString = (val: any) => (val || '').toString().trim().replace(/^\.+/, '').replace(/\.+$/, '').replace(/\s+/g, ' ').trim();
    const normalizePersian = (str: string) => str.replace(/[\u200c\u200d\s]/g, '').trim();
    const splitFullName = (fullName: string) => {
        const parts = fullName.trim().split(/\s+/);
        return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
    };
    const getDefaultAirport = (city: string) => {
        const normalized = normalizePersian(city);
        const match = cityAirports.find(c => normalizePersian(c.persianCity) === normalized);
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

    const header: string[] = rows[0].map((h: string) => h.trim());
    const col: Record<string, number> = {};
    header.forEach((h, idx) => { col[h] = idx; });

    const insert = db.prepare(`INSERT INTO tickets (
        row_number, reference, watcher, first_name_persian, last_name_persian,
        first_name_english, last_name_english, origin_city, destination_city,
        origin_airport, destination_airport, flight_date, flight_time,
        ticket_price, penalty_percent, total_price, max_baggage, airline, flight_number, group_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

    const insertMany = db.transaction((records: any[]) => {
        for (const rec of records) insert.run(rec);
    });

        const recordsToInsert: any[] = [];
        let rowCount = 0;

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const fullName = cleanString(row[col['نام و نام خانوادگی']]);
            const originCity = cleanString(row[col['مبدأ']]);
            const destCity = cleanString(row[col['مقصد']]);
            const flightDate = cleanString(row[col['تاریخ پرواز']]);
            if (!fullName || !originCity || !destCity || !flightDate) continue;

            const { firstName, lastName } = splitFullName(fullName);
            const ticketPrice = parseInt(toEnglishDigits(cleanString(row[col['مبلغ بلیط (ریال)']] || '0'))) || 0;
            const penalty = parseInt(toEnglishDigits(cleanString(row[col['درصد جریمه']] || '0'))) || 0;
            let totalPrice = parseInt(toEnglishDigits(cleanString(row[col['مبلغ کل (ریال)']] || '0'))) || 0;
            if (!totalPrice) totalPrice = Math.round(ticketPrice * (1 - penalty / 100));

            const airlineFlightRaw = cleanString(row[col['ایرلاین و شماره پرواز']] || '');
            const { flightNumber, airlinePersian } = parseAirlineFlight(airlineFlightRaw);

            recordsToInsert.push([
                rowCount + 1,                    // row_number
                generateReference(),
                                 generateWatcher(),
                                 firstName,
                                 lastName,
                                 '',                              // first_name_english
                                 '',                              // last_name_english
                                 originCity,
                                 destCity,
                                 getDefaultAirport(originCity),
                                 getDefaultAirport(destCity),
                                 flightDate,
                                 cleanString(row[col['ساعت']] || ''),
                                 ticketPrice,
                                 penalty,
                                 totalPrice,
                                 20,                              // default max baggage
                                 airlinePersian,
                                 flightNumber,
                                 null                             // group_id
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

// ---------- App startup ----------
app.whenReady().then(() => {
    initDatabase();
    autoSeedIfEmpty();      // auto‑seed runs here, before the window appears
    createWindow();

    // ---------- Auto‑updater ----------
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
        mainWindow?.webContents.send('update-message', 'Checking for updates...');
    });
    autoUpdater.on('update-available', (info) => {
        mainWindow?.webContents.send('update-available', info);
    });
    autoUpdater.on('update-not-available', (info) => {
        mainWindow?.webContents.send('update-not-available', info);
    });
    autoUpdater.on('error', (err) => {
        mainWindow?.webContents.send('update-error', err);
    });
    autoUpdater.on('update-downloaded', (info) => {
        mainWindow?.webContents.send('update-downloaded', info);
    });

    ipcMain.handle('start-download', () => autoUpdater.downloadUpdate());
    ipcMain.on('install-update', () => autoUpdater.quitAndInstall());

    // ---------- Application menu ----------
    const menuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                { role: 'quit', label: 'Exit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'zoomIn', label: 'Zoom In' },
                { role: 'zoomOut', label: 'Zoom Out' },
                { role: 'resetZoom', label: 'Reset Zoom' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Check for Update',
                    click: () => {
                        // Show the loading indicator in the UI
                        mainWindow?.webContents.send('update-message', 'Checking for updates...');

                        let checkStarted = false;
                        const timeout = setTimeout(() => {
                            if (!checkStarted) {
                                // In dev mode, no provider exists – fake a "not available" response
                                mainWindow?.webContents.send('update-not-available', {});
                            }
                        }, 3000);  // wait 3 seconds before falling back

                        const onChecking = () => {
                            checkStarted = true;
                            clearTimeout(timeout);
                        };

                        autoUpdater.once('checking-for-update', onChecking);
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

// ---------- Database IPC ----------
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
