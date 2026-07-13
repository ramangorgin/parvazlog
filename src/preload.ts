import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getAllTickets: () => ipcRenderer.invoke('db:getAllTickets'),
                                getTicketById: (id: number) => ipcRenderer.invoke('db:getTicketById', id),
                                insertTicket: (ticket: any) => ipcRenderer.invoke('db:insertTicket', ticket),
                                updateTicket: (id: number, ticket: any) => ipcRenderer.invoke('db:updateTicket', id, ticket),
                                deleteTicket: (id: number) => ipcRenderer.invoke('db:deleteTicket', id),
                                getMaxRowNumber: () => ipcRenderer.invoke('db:getMaxRowNumber'),
                                saveImage: (dataUrl: string, defaultName: string) => ipcRenderer.invoke('save-image', dataUrl, defaultName),
});

onUpdateMessage: (callback: (message: string) => void) => ipcRenderer.on('update-message', (_, msg) => callback(msg)),
onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', (_, info) => callback(info)),
onUpdateNotAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-not-available', (_, info) => callback(info)),
onUpdateError: (callback: (err: any) => void) => ipcRenderer.on('update-error', (_, err) => callback(err)),
onDownloadProgress: (callback: (percent: number) => void) => ipcRenderer.on('download-progress', (_, percent) => callback(percent)),
onUpdateDownloaded: (callback: (info: any) => void) => ipcRenderer.on('update-downloaded', (_, info) => callback(info)),
