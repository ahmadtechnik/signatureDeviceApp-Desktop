// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView
} = require('electron')
const path = require('path')
const fs = require("fs");

// to disable https untrust sites 
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
let mainWindow

function createWindow() {
  const staticData = fs.readFileSync("./static.json")
  const parsedData = JSON.parse(staticData).serverData;
  console.log(parsedData);
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // add new view window to main window 



  console.log(parsedData.PROTOCOL + "://" + parsedData.IP + ":" + parsedData.PORT + "/" + parsedData.DIR)
  mainWindow.loadURL(parsedData.PROTOCOL + "://" + parsedData.IP + ":" + parsedData.PORT + "/" + parsedData.DIR);


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('ready', createWindow)


app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {

  if (mainWindow === null) createWindow()
})