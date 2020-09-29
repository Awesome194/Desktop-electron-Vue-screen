const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: 1300,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.setMenu(null)
  // and load the index.html of the app.
  win.loadFile('templates/index.html')

  //win.webContents.openDevTools()

}

app.whenReady().then(createWindow)

