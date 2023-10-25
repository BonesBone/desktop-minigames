/* preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
*/

/*
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})
*/
const { contextBridge, ipcRenderer } = require('electron')
const Renderer = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  //save methods for saving data
  saveTTTData: (data) => ipcRenderer.send('save-TTT-data', data),

  //allow for electron-store usage in render processes
  storeGet: (key) => { 
    ipcRenderer.send('get-store-item', key)

    ipcRenderer.once('item-received', (val) => {
      Renderer.send(val)
    })
    
  },

  /*
  store: {
    get(key) {
      alert("running")
      return ipcRenderer.sendSync('electron-store-get', key);
    }
  }*/
})