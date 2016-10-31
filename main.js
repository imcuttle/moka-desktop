const electron = require('electron')
// const mdEditor = require('moyu-markdown-editor')
const path = require('path')
const pack = require('./package.json')

// Module to control application life.
const app = electron.app
const protocol = electron.protocol
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const nativeImage = require('electron').nativeImage

const ipcMain = require('electron').ipcMain;
const processes = []

ipcMain.on('process-push', (ev, proc) => {
  console.log('process-push', proc.pid)
  processes.push(proc);
})
ipcMain.on('process-splice', (ev, i) => {
  console.log('process-splice', i)
  processes.splice(i, 1);
})
ipcMain.on('process-remove', (ev, pid) => {
  console.log('process-remove', pid)
  var i = processes.findIndex(x=>x.pid==pid);
  if(i>=0) {
    // process.kill(processes[i].pid, 'SIGINT');
    processes.splice(i, 1);
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  // Create the browser window
  // protocol.registerFileProtocol('moka-pc', (request, callback) => {
  //   const url = request.url.substr(7)
  //   console.log(url);
  //   callback({path: path.normalize(`${__dirname}/${url}`)})
  // }, (error) => {
  //   if (error) console.error('Failed to register protocol')
  // })

  mainWindow = new BrowserWindow({
    width: 1000, height: 600,
    defaultEncoding: 'utf-8',
    icon: path.join(__dirname, 'build', 'icon.icns')
  })

  mainWindow.setTitle(pack.name)

  // mdEditor(9889, path.resolve('source', 'upload'));
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.loadURL(`http://localhost:9669`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('closed', processes.length)
    processes.forEach((proc, i)=>{process.kill(proc.pid, 'SIGINT'); processes.splice(i, 1)})
    mainWindow = null
  })
  console.log('platform: '+process.platform)

  require('./menu')

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  console.log('window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
