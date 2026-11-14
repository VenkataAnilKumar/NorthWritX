// Bridge for the shell's own pages (the connection screen). The NorthWrit web app
// itself gets no privileged APIs — it must behave identically in a browser —
// with one deliberate exception: guestCredentials, which the login page uses
// to offer "Continue as guest" in local mode. It is read-only and gated
// main-side to local mode + the local frontend's origin.

const { contextBridge, ipcRenderer } = require("electron");

const desktopBridge = {
  getServerUrl: () => ipcRenderer.invoke("northwrit:get-server-url"),
  setServerUrl: (url) => ipcRenderer.invoke("northwrit:set-server-url", url),
  retry: () => ipcRenderer.invoke("northwrit:retry"),
  // Local mode (self-contained stack). startLocal is gated main-side to the
  // shell's own pages; localAvailable and onLocalStatus are read-only.
  localAvailable: () => ipcRenderer.invoke("northwrit:local-available"),
  startLocal: () => ipcRenderer.invoke("northwrit:start-local"),
  chooseCloud: () => ipcRenderer.invoke("northwrit:choose-cloud"),
  guestCredentials: () => ipcRenderer.invoke("northwrit:guest-credentials"),
  openConnect: () => ipcRenderer.invoke("northwrit:open-connect"),
  onLocalStatus: (cb) =>
    ipcRenderer.on("northwrit:local-status", (_event, msg) => cb(String(msg))),
};

contextBridge.exposeInMainWorld("northwritDesktop", desktopBridge);
// Temporary bridge alias for existing desktop clients.
contextBridge.exposeInMainWorld("mikeDesktop", desktopBridge);
