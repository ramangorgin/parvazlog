"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Database
    getAllTickets: () => electron_1.ipcRenderer.invoke('db:getAllTickets'),
    getTicketById: (id) => electron_1.ipcRenderer.invoke('db:getTicketById', id),
    insertTicket: (ticket) => electron_1.ipcRenderer.invoke('db:insertTicket', ticket),
    updateTicket: (id, ticket) => electron_1.ipcRenderer.invoke('db:updateTicket', id, ticket),
    deleteTicket: (id) => electron_1.ipcRenderer.invoke('db:deleteTicket', id),
    getMaxRowNumber: () => electron_1.ipcRenderer.invoke('db:getMaxRowNumber'),
    clearAllTickets: () => electron_1.ipcRenderer.invoke('db:clearAll'),
    // File export
    saveImage: (dataUrl, defaultName) => electron_1.ipcRenderer.invoke('save-image', dataUrl, defaultName),
    // Update
    startDownload: () => electron_1.ipcRenderer.invoke('start-download'),
    installUpdate: () => electron_1.ipcRenderer.send('install-update'),
    onUpdateMessage: (callback) => electron_1.ipcRenderer.on('update-message', (_, msg) => callback(msg)),
    onUpdateAvailable: (callback) => electron_1.ipcRenderer.on('update-available', (_, info) => callback(info)),
    onUpdateNotAvailable: (callback) => electron_1.ipcRenderer.on('update-not-available', () => callback()),
    onUpdateError: (callback) => electron_1.ipcRenderer.on('update-error', (_, err) => callback(err)),
    onUpdateDownloaded: (callback) => electron_1.ipcRenderer.on('update-downloaded', () => callback()),
    // Excel import/export (direct calls from UI buttons)
    importExcel: () => electron_1.ipcRenderer.invoke('import-excel'),
    exportExcel: () => electron_1.ipcRenderer.invoke('export-excel'),
});
