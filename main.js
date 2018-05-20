const electron = require('electron');
const os = require('os');
const drivelist = require("drivelist");
// const fs = require('fs');
// const promisify = require('util').promisify;
// Module to control application life.
const {app, BrowserWindow, session, Menu, MenuItem, ipcMain} = electron;

const path = require('path')
const url = require('url')

// const readDirAsync = promisify(fs.readdir);

// const fetchDirList = async (path) => {
// const dirResults = await readDirAsync('C:\\testDir');
// return dirResults;
// };


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let unresponsiveEventWindow;
let testWindow;

const mainMenu = Menu.buildFromTemplate(require('./menus/mainMenu'));

async function createWindow () {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    width: 545, 
    height: 655,
    minWidth:545,
    minHeight:655,
    maxWidth:545,
    maxHeight:655
  });

  //const mainSession = mainWindow.webContents.session;

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/main.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.on('did-finish-load', ()=>{
   
    mainWindow.webContents.send('data', "New message send from main to renderer");
  });

  //main window on foucs event
  // mainWindow.on('focus', () => {
  //   console.log("main window focused");
  // });
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //listen for on unresponsive event
  mainWindow.on('unresponsive', ()=>{
    unresponsiveEventWindow = new BrowserWindow({
      width:350,
      height:280,
      maxWidth: 350, 
      maxHeight: 280,
      minWidth:350,
      minHeight:280
    });
    unresponsiveEventWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/unresponsiveApp.html'),
      protocol: 'file:',
      slashes: true
    }));
  });

   //listen for on resposive event
   mainWindow.on('responsive', ()=>{
    unresponsiveEventWindow = null;
  });
  // Emitted when the window is closed.

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow(), Menu.setApplicationMenu(mainMenu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
