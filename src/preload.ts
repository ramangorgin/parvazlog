import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Database
    getAllTickets: () => ipcRenderer.invoke('db:getAllTickets'),
                                getTicketById: (id: number) => ipcRenderer.invoke('db:getTicketById', id),
                                insertTicket: (ticket: any) => ipcRenderer.invoke('db:insertTicket', ticket),
                                updateTicket: (id: number, ticket: any) => ipcRenderer.invoke('db:updateTicket', id, ticket),
                                deleteTicket: (id: number) => ipcRenderer.invoke('db:deleteTicket', id),
                                getMaxRowNumber: () => ipcRenderer.invoke('db:getMaxRowNumber'),

                                // File export
                                saveImage: (dataUrl: string, defaultName: string) => ipcRenderer.invoke('save-image', dataUrl, defaultName),

                                // Update
                                startDownload: () => ipcRenderer.invoke('start-download'),
                                installUpdate: () => ipcRenderer.send('install-update'),

                                // Update events
                                onUpdateMessage: (callback: (message: string) => void) => ipcRenderer.on('update-message', (_, msg) => callback(msg)),
                                onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', (_, info) => callback(info)),
                                onUpdateNotAvailable: (callback: () => void) => ipcRenderer.on('update-not-available', () => callback()),
                                onUpdateError: (callback: (err: any) => void) => ipcRenderer.on('update-error', (_, err) => callback(err)),
                                onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update-downloaded', () => callback()),
});
