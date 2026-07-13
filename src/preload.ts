import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getAllTickets: () => ipcRenderer.invoke('db:getAllTickets'),
                                getTicketById: (id: number) => ipcRenderer.invoke('db:getTicketById', id),
                                insertTicket: (ticket: any) => ipcRenderer.invoke('db:insertTicket', ticket),
                                updateTicket: (id: number, ticket: any) => ipcRenderer.invoke('db:updateTicket', id, ticket),
                                deleteTicket: (id: number) => ipcRenderer.invoke('db:deleteTicket', id),
                                getMaxRowNumber: () => ipcRenderer.invoke('db:getMaxRowNumber'),
                                saveImage: (dataUrl: string, defaultName: string) => ipcRenderer.invoke('save-image', dataUrl, defaultName),
                                startDownload: () => ipcRenderer.invoke('start-download'),
                                installUpdate: () => ipcRenderer.send('install-update'),

                                // Update events
                                onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', (_, info) => callback(info)),
                                onUpdateNotAvailable: (callback: () => void) => ipcRenderer.on('update-not-available', () => callback()),
                                onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update-downloaded', () => callback()),
});
