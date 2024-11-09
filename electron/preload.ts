// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: unknown) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
  },
});
