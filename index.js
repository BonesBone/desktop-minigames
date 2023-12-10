// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain} = require('electron')
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

/*  
 *  ---~~--~~ MAIN CODE BELOW ~~--~~---
*/
// ipcMain.on('electron-store-get', (val) => {
//   // event.returnValue = storage.get(val);
//   return storage.get(val);
// });

// ipcMain.on('save-TTT-data', (event, data) => {
//   storage.set('Player1Wins', storage.get('Player1Wins', 0) + data[0])
//   storage.set('Player2Wins', storage.get('Player2Wins', 0) + data[1])
//   storage.set('gamesTied', storage.get('gamesTied', 0) + data[2])    
// })
