const { app, BrowserWindow, Menu, ipcMain } = require("electron/main");
const path = require("node:path");
const started = require("electron-squirrel-startup");

if (started) {
    app.quit();
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1360,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    //win.loadFile(path.join(__dirname, './react-integration/build/index.html'));
    win.loadURL("http://localhost:3000");
    Menu.setApplicationMenu(null);
};

app.whenReady().then(() => {
    createWindow();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
