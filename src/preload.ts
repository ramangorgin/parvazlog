import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Database
    getAllTickets: () => ipcRenderer.invoke('db:getAllTickets'),
                                getTicketById: (id: number) => ipcRenderer.invoke('db:getTicketById', id),
                                insertTicket: (ticket: any) => ipcRenderer.invoke('db:insertTicket', ticket),
                                updateTicket: (id: number, ticket: any) => ipcRenderer.invoke('db:updateTicket', id, ticket),
                                deleteTicket: (id: number) => ipcRenderer.invoke('db:deleteTicket', id),
                                deleteMultipleTickets: (ids: number[]) => ipcRenderer.invoke('db:deleteMultipleTickets', ids),
                                getMaxRowNumber: () => ipcRenderer.invoke('db:getMaxRowNumber'),
                                clearAllTickets: () => ipcRenderer.invoke('db:clearAll'),

                                // File export
                                saveImage: (dataUrl: string, defaultName: string) => ipcRenderer.invoke('save-image', dataUrl, defaultName),

                                // Excel import/export
                                importExcel: () => ipcRenderer.invoke('import-excel'),
                                exportExcel: () => ipcRenderer.invoke('export-excel'),

                                // Update
                                checkUpdate: () => ipcRenderer.invoke('check-update'),
                                startDownload: (url: string) => ipcRenderer.send('start-download', url),
                                installUpdate: () => ipcRenderer.send('install-update'),

                                // Update events
                                onUpdateMessage: (callback: (msg: string) => void) => ipcRenderer.on('update-message', (_, msg) => callback(msg)),
                                onUpdateAvailable: (callback: (info: any) => void) => ipcRenderer.on('update-available', (_, info) => callback(info)),
                                onUpdateNotAvailable: (callback: () => void) => ipcRenderer.on('update-not-available', () => callback()),
                                onUpdateError: (callback: (err: any) => void) => ipcRenderer.on('update-error', (_, err) => callback(err)),
                                onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update-downloaded', () => callback()),
                                onDownloadProgress: (callback: (percent: number) => void) => ipcRenderer.on('download-progress', (_, p) => callback(p)),
});
