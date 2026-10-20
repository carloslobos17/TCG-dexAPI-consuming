const { app, BrowserWindow } = require('electron')
const path = require('path')

process.env.NODE_ENV = 'dev'

const isMac = process.platform !== 'darwin'
const isDev = process.env.NODE_ENV === 'dev'

// Crear ventana Principal
function createMainWindow(
) {
    const mainWindow = new BrowserWindow({
        title: 'Redimensionar Imagen',
        width: isDev ? 1200 : 600,
        height: 800
    })

    //Abre DevTools si esta en env dev
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

// Cuando la app esta lista cre la ventana
app.whenReady().then(() => {
    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})

