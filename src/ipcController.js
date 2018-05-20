const {ipcMain} = require('electron');
const fetchDir = require('../helpers/fetchDir');
//event listeners from client
ipcMain.on("data", async (e, payload)=>{
    console.log("received message from renderer at main here is tha payload ",payload );
    if(payload === "ready"){
        //const files = await fetchDir();
        //e.sender.send("fetchedDir", files);

    }
  });

module.exports = ipcMain;