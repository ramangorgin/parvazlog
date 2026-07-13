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
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'logo.png'), // logo for window
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
electron_1.app.whenReady().then(() => {
    (0, database_1.initDatabase)();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// --- Database IPC (unchanged) ---
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
