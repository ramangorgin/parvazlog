import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';   // only valid after app ready, but we call it after ready

let db: Database.Database;

export function initDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'parvazlog.db');
    db = new Database(dbPath);
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
        flight_date TEXT NOT NULL,    -- Jalali date as YYYY/MM/DD
        flight_time TEXT NOT NULL,    -- HH:MM
        ticket_price INTEGER NOT NULL,  -- Rial
        penalty_percent INTEGER NOT NULL DEFAULT 0,
        total_price INTEGER NOT NULL,
        max_baggage INTEGER NOT NULL,
        airline TEXT NOT NULL,
        flight_number TEXT NOT NULL,
        group_id TEXT                  -- nullable, to link group bookings
    );
    CREATE INDEX IF NOT EXISTS idx_group ON tickets(group_id);
    `);
}

export function getDb(): Database.Database {
    if (!db) throw new Error('Database not initialised');
    return db;
}

// CRUD helpers for renderer use (will be called via IPC later, but we keep it simple: directly invoked from preload? No, better to expose via contextBridge or direct require. Since we are in renderer we could use remote? Not recommended. Instead we'll use IPC channel. But for MVP speed, we'll put the database logic in the main process and expose via IPC. However we already have preload. I'll create a separate IPC channel for database operations. Let's add them in main.ts and call from renderer via ipcRenderer.invoke. This is cleaner. We'll adjust. Actually to minimise files, we can keep db operations in the main process and use IPC. I'll add a dbApi exposed in preload for all needed operations. Let's do that.
// I will write IPC handlers in main.ts for all CRUD, and expose them in preload. This avoids requiring database in renderer.
