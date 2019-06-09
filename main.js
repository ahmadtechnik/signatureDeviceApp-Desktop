// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView,
  WebContents,
  ipcMain,
} = require('electron')
const path = require('path')
const fs = require("fs");


// to disable https untrust sites 
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
let mainWindow

function createWindow() {
  const staticData = fs.readFileSync("./static.json")
  const parsedData = JSON.parse(staticData).serverData;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon: "./assets/mainico.ico",
    show: false
  });

  // main widnows on actions
  mainWindow
    .on('closed', function () {
      mainWindow = null
    })
    // on main widnow ready to show
    .on("ready-to-show", () => { //Microsoft Print To PDF
      mainWindow.show();
    })

  // init main win webcontent
  var mainWinWebContent = mainWindow.webContents;
  
  mainWinWebContent.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.log(errorCode, errorDescription)
  })



  subWindow(mainWindow);

  // add new view window to main window 
  mainWindow.loadURL(parsedData.PROTOCOL + "://" + parsedData.IP + ":" + parsedData.PORT + "/" + parsedData.DIR);

}

// app on actions
app
  .on('ready', createWindow)
  .on('browser-window-created', function (e, window) {
    window.setMenu(null);
  })
  .on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  .on('activate', function () {
    if (mainWindow === null) createWindow()
  })

/** 
 * create window to get server-side device data 
 * 
 * */
var subWidow
var subWindow = (mainWind) => {
  //
  let subWindowOptions = {
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: mainWind,
    modal: true,
    skipTaskbar: true
  }
  //
  subWidow = new BrowserWindow(subWindowOptions);
  //
  subWidow.loadFile("./views/getServerSideDataForm.html");
  subWidow.webContents.openDevTools()
  //
  subWidow.on("close", () => {

  });
  //
  return subWidow;
}
// get data from form data getter ; first window
//ipcMain.on("formdata")