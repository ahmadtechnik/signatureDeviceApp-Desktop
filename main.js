// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView,
  WebContents,
  ipcMain,
} = require('electron');

const path = require('path')
const fs = require("fs");
const io = require("socket.io-client");


// to disable https untrust sites 
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');


// String constants
var _GETTER_DATA_FORM_PATH = "./views/getServerSideDataForm.html";
var _STATIC_FILE_PATH = "./static.json"
var _MAINWINDOW_ICON_PATH = "./assets/mainico.ico";

// Objects constants
let mainWindow
var subWidow

var staticData = fs.readFileSync(_STATIC_FILE_PATH);
var parsedData = JSON.parse(staticData).serverData;


function createWindow() {


  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon: _MAINWINDOW_ICON_PATH,
    show: false,
    resizable: true,
    title: "Signature Client-Side System"
  });

  const subWind = subWindow(mainWindow);;

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

    // show modal window in cas failed to load the URL
    subWind.show();
    // send error message to render modal in to show it to user
    subWind.webContents.send("errrField", {
      msg: errorDescription
    });

  }).on("did-finish-load", () => {
    // to check if there is any inner server error such as
    // page could not be found 
    if (mainWinWebContent.getTitle() === "Error") {
      subWind.webContents.send("errrField", {
        msg: "COULD NOT FIND THE SUB DIR"
      });
      // start showing form to user to re enter the data 
      subWind.show();
    } else {

    }
  })

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

var subWindow = (mainWind) => {
  mainWind.hide();
  //
  let subWindowOptions = {
    width: 600,
    height: 500,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: mainWind,
    modal: true,
    show: false,
    frame: false,
    thickFrame : false
  }
  //
  subWidow = new BrowserWindow(subWindowOptions);
  subWindowWebContent = subWidow.webContents;
  //
  subWidow.loadFile(_GETTER_DATA_FORM_PATH);
  //
  subWidow
    .on("close", () => {})
    // in case was the modal ready to show.
    .on("ready-to-show", () => {
      subWindowWebContent.send("readyToShow")
    });

  // to show web devTools after instantiate the sub window modal
  subWindowWebContent.on("did-finish-load", () => {
    //subWindowWebContent.openDevTools()
  })

  // to return sub window object after initialize it
  return subWidow;
}

// get data from form data getter ; first window
ipcMain.on("changeStaticFileContent", (event, arg) => {
  // get data from render form
  var protocol = arg.protocol;
  var hostname = arg.hostname;
  var port = arg.port;
  var subDir = arg.subDir;

  // to rewrite json file after changing the entered data
  parsedData.PROTOCOL = protocol
  parsedData.IP = hostname
  parsedData.PORT = port
  parsedData.DIR = subDir
  // create new serverData object to store the getted data inside..
  var toWrite = {
    serverData: parsedData
  }

  // add new view window to main window 
  mainWindow.loadURL(protocol + "://" + hostname + ":" + port + "/" + subDir);
  // to write json file after getting the data 
  fs.writeFileSync(_STATIC_FILE_PATH, JSON.stringify(toWrite));

  // to hide the modal window in case was the entered data correct
  subWidow.hide();
})

/** in case user wanted to close sub window modal */
ipcMain.on("closeSubWindowModal", () => {
  // in case user clicked close sub window should also the main window clos
  // that is mean the app will destroy 
  app.exit(0)
})