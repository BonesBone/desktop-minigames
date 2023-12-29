// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')

const Store = require('electron-store')
Store.initRenderer()
// const storage = new Store()

let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('openDialog', () => {
  dialog.showMessageBox(window, {
      'type': 'question',
      'title': 'Confirmation',
      'message': "Are you sure?",
      'buttons': [
          'Yes',
          'No'
      ]
  })
    // Dialog returns a promise so let's handle it correctly
    .then((result) => {
        // Bail if the user pressed "No" or escaped (ESC) from the dialog box
        if (result.response !== 0) { return; }

        // Testing.
        if (result.response === 0) {
            console.log('The "Yes" button was pressed (main process)');
        }

        // Reply to the render process
        window.webContents.send('dialogResponse', result.response);
    })
})