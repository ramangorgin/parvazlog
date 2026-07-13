import { autoUpdater } from 'electron-updater';
import { Menu } from 'electron';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { initDatabase, getDb } from './database';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'logo.png'),   // logo for window
                                   webPreferences: {
                                       preload: path.join(__dirname, 'preload.js'),
                                   contextIsolation: true,
                                   nodeIntegration: false,
                                   },
    });

    // Load the final dist/index.html
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Maximise (fills screen, not true fullscreen)
    mainWindow.maximize();

    mainWindow.on('closed', () => { mainWindow = null; });
}
autoUpdater.autoDownload = false;     // let user decide
autoUpdater.autoInstallOnAppQuit = true;

const menuTemplate: any = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'Check for Update',
                click: () => { autoUpdater.checkForUpdates(); }
            }
        ]
    }
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
    initDatabase();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- Database IPC (unchanged) ---
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
autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('download-progress', progress.percent);
});
autoUpdater.on('update-downloaded', (info) => {
    mainWindow?.webContents.send('update-downloaded', info);
});
