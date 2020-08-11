const { app, BrowserWindow, Menu, Tray } = require("electron");
const { argv } = require("yargs");

const Store = require("electron-store");

const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
}

app.on("second-instance", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized())
            mainWindow.restore();

        mainWindow.focus();
    }
});

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4229.0 Safari/537.36";

const store = new Store();

let mainWindow;
let tray;

app.userAgentFallback = userAgent;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width           : store.get("window.width")  || 1024,
        height          : store.get("window.height") || 768,
        x               : store.get("window.x"),
        y               : store.get("window.y"),
        backgroundColor : "#131C21",
        icon            : `${ __dirname }/icon.ico`,
        show            : false,
        title           : "WhatsApp",
        webPreferences: {
            webviewTag: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.setMenu(null);

    let minimizedFirstOpen = false;

    mainWindow.once("ready-to-show", async() => {
        if (!argv.startMinimized) {
            if (store.get("window.maximized"))
                mainWindow.maximize();
            else
                mainWindow.show();
        } else {
            minimizedFirstOpen = true;
        }

        // mainWindow.webContents.openDevTools();
    });

    mainWindow.on("close", (event) => {
        event.preventDefault();

        mainWindow.hide();
    });

    mainWindow.on("closed", async() => {
        mainWindow = null;
    });

    tray = new Tray(`${ __dirname }/icon.ico`);

    tray.on("double-click", () => {
        if (minimizedFirstOpen) {
            minimizedFirstOpen = false;

            if (store.get("window.maximized"))
                mainWindow.maximize();
            else
                mainWindow.show();
        } else {
            mainWindow.show();
        }
    });

    const contextMenu = Menu.buildFromTemplate([{
        label: "Exit",
        click() {
            if (!mainWindow.isMaximized())
                store.set("window", mainWindow.getBounds());

            store.set("window.maximized", mainWindow.isMaximized());

            mainWindow.destroy();

            app.quit();

            setTimeout(() => {
                app.exit();
            }, 1000)
        }
    }]);

    tray.setToolTip("WhatsApp");
    tray.setContextMenu(contextMenu);

    mainWindow.on("page-title-updated", (event, title) => {
        mainWindow.setTitle(title);
        tray.setToolTip(title);

        if (/^\(\d+\)/.test(title))
            tray.setImage(`${ __dirname }/icon-unread.ico`);
        else
            tray.setImage(`${ __dirname }/icon.ico`);
    });

    mainWindow.loadURL("https://web.whatsapp.com/", {
        userAgent: userAgent
    });
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});