const electron = require('electron')
// const mdEditor = require('moyu-markdown-editor')
const path = require('path')
const pack = require('./package.json')
const shell = require('./api/shell')

// Module to control application life.
const app = electron.app
const protocol = electron.protocol
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const nativeImage = require('electron').nativeImage

const Tray = electron.Tray

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
  const appIcon = new Tray(path.join(__dirname, 'moyu1.png'))

  mainWindow = new BrowserWindow({
    width: 1000, height: 600,
    defaultEncoding: 'utf-8',
    icon: path.join(__dirname, 'build', 'icon.icns')
  })
  console.log(appIcon, mainWindow)

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
    console.log('closed', shell.getProcesses())
    shell.getProcesses().forEach(proc=>proc.kill('SIGHUP'))
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
  console.log('window-all-closed', shell.getProcesses())
  shell.getProcesses().forEach(proc=>proc.kill('SIGHUP'))
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
