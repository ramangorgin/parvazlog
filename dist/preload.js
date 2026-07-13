"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getAllTickets: () => electron_1.ipcRenderer.invoke('db:getAllTickets'),
    getTicketById: (id) => electron_1.ipcRenderer.invoke('db:getTicketById', id),
    insertTicket: (ticket) => electron_1.ipcRenderer.invoke('db:insertTicket', ticket),
    updateTicket: (id, ticket) => electron_1.ipcRenderer.invoke('db:updateTicket', id, ticket),
    deleteTicket: (id) => electron_1.ipcRenderer.invoke('db:deleteTicket', id),
    getMaxRowNumber: () => electron_1.ipcRenderer.invoke('db:getMaxRowNumber'),
    saveImage: (dataUrl, defaultName) => electron_1.ipcRenderer.invoke('save-image', dataUrl, defaultName),
});
