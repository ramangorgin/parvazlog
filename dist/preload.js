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
    deleteMultipleTickets: (ids) => electron_1.ipcRenderer.invoke('db:deleteMultipleTickets', ids),
    getMaxRowNumber: () => electron_1.ipcRenderer.invoke('db:getMaxRowNumber'),
    clearAllTickets: () => electron_1.ipcRenderer.invoke('db:clearAll'),
    // File export
    saveImage: (dataUrl, defaultName) => electron_1.ipcRenderer.invoke('save-image', dataUrl, defaultName),
    // Excel import/export
    importExcel: () => electron_1.ipcRenderer.invoke('import-excel'),
    exportExcel: () => electron_1.ipcRenderer.invoke('export-excel'),
    // Update
    checkUpdate: () => electron_1.ipcRenderer.invoke('check-update'),
    startDownload: (url) => electron_1.ipcRenderer.send('start-download', url),
    installUpdate: () => electron_1.ipcRenderer.send('install-update'),
    // Update events
    onUpdateMessage: (callback) => electron_1.ipcRenderer.on('update-message', (_, msg) => callback(msg)),
    onUpdateAvailable: (callback) => electron_1.ipcRenderer.on('update-available', (_, info) => callback(info)),
    onUpdateNotAvailable: (callback) => electron_1.ipcRenderer.on('update-not-available', () => callback()),
    onUpdateError: (callback) => electron_1.ipcRenderer.on('update-error', (_, err) => callback(err)),
    onUpdateDownloaded: (callback) => electron_1.ipcRenderer.on('update-downloaded', () => callback()),
    onDownloadProgress: (callback) => electron_1.ipcRenderer.on('download-progress', (_, p) => callback(p)),
    // Export path
    getExportPath: () => electron_1.ipcRenderer.invoke('get-export-path'),
    setExportPath: () => electron_1.ipcRenderer.invoke('set-export-path'),
});
