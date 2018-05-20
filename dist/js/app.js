// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote, ipcRenderer} = require('electron');
const fs = require('fs');
const promisify = require('util').promisify;
const drivelist = require("drivelist");
const readDirAsync = promisify(fs.readdir);
const mkDirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);



const fetchDrives = async () => {
    drivelist.list((err, drives)=>{
        if(err) throw err;
        const listElement = document.getElementById("dir-items");
        const dirListTitle = document.getElementById('dir-list-title');
        const dirListBackBtn = document.getElementById('dir-list-back');
        const selectBtnContainer = document.getElementById("selectBtnContainer");
        listElement.innerHTML = '';
        dirListTitle.innerHTML = 'Drives';
        dirListBackBtn.classList.add('is-invisible');
        selectBtnContainer.classList.add('is-invisible');
        let html = '';
        
        drives.forEach((drive)=>{
          console.log(drive);
          const li =  `   
                                <a class="panel-block" id="drive_el${drive.mountpoints[0].path}" ondblclick="fetchDir('${drive.mountpoints[0].path+'\\'}')">
                                    <span class="panel-icon">
                                    <i class="fas fa-hhd" aria-hidden="true"></i>
                                    </span>
                                    ${drive.mountpoints[0].path}
                                </a>
                                
                        `;
           html += li;          
        })
        listElement.innerHTML = html;
      })
};


const fetchDir = async (path, sort) => {
    try {
        const dirResults = await readDirAsync(path);
        const listElement = document.getElementById("dir-items");
        const dirListTitle = document.getElementById('dir-list-title');
        const dirListBackBtn = document.getElementById('dir-list-back');
        const selectBtnContainer = document.getElementById("selectBtnContainer");
            if(!sort) {
                listElement.innerHTML = '';
                dirListTitle.innerHTML = path;
                dirListBackBtn.classList.remove("is-invisible");
                selectBtnContainer.classList.remove('is-invisible');
                let html = '';
                dirResults.forEach((fileName)=>{
                    let icon = 'file';
                    if(!fileName.includes(".")){icon = 'folder-open'}
                    if(fileName.toLowerCase().includes(".pdf")){icon = 'file-pdf-o'}
                    if(fileName.toLowerCase().includes(".jpg")){icon = 'file-picture-o'}
                    if(fileName.toLowerCase().includes(".txt")){icon = 'align-right'}
                    console.log("Path", path)
                    console.log("FileNAme", fileName)
                    const li =  `   
                                        <a class="panel-block" ondblclick='fetchDir("${path+'\\'+"/"+fileName}")'>
                                            <span class="panel-icon">
                                            <i class="fas fa-${icon}" aria-hidden="true"></i>
                                            </span>
                                            ${fileName}
                                        </a>
                                        
                                `;
                html += li;                        
                });
                listElement.innerHTML = html;
                console.log("LIST",listElement);
            } else {
                return dirResults;
            }
    } catch (err) {
        console.log("Fetch Dir Catch ERRROR:",err)
    }
};

const createFolder = async (path, folderName) => {
    try{
        await mkDirAsync(path+'/'+folderName);
        return path+'/'+folderName;
    } catch(err){
        throw err;
    }
};

const creatFolders = async (path,seen) => {
    try{
        for(let orderNum in seen){
            console.log("Seen order number",seen);
            let folderName = seen[orderNum];
            console.log("folder 1", folderName);
            folderName = folderName.replace(orderNum, "");
            console.log("filder name 2", folderName);
            folderName = folderName.split(' ');
            console.log("Folder name 3 arr", folderName);
            let notReady = true;
               if(typeof(parseInt(folderName[0])) === 'number'){
                    folderName.splice(0,1);
               }
             folderName = folderName.join(" ");
             folderName = folderName.split(".")[0];
             folderName = folderName.replace("  ", " ");
            console.log("folder name 5", folderName);
            folderName = folderName+" "+orderNum;
            const newDir = await createFolder(path,folderName);
            await createFolder(newDir,"Art");
            await createFolder(newDir,"Production");
            await createFolder(newDir,"Sales Order");
            await createFolder(newDir,"SPI");
            return(true);
        }
    } catch(err){
        console.log("error in createFolder Funtction",err);
        return(false);
    }
};

const goBack = async () => {
    const path = document.getElementById("dir-list-title").innerText;
    console.log(path);
    if(path.includes('/')){
        const newPath = path.split('/');
        newPath.splice(newPath.length-1, 1);
        const finalPath = newPath.join("/");
        console.log(finalPath);
        fetchDir(finalPath)
    } else {
        console.log("at drive root.");
        fetchDrives();
    }
};

const sortFolder = async () => {
    try {
        const path = document.getElementById("dir-list-title").innerText;
        console.log("Path",path);
        const startsWithNumRegEx = /^\d{5,}/;
        const seen = {};
        const dirList = await fetchDir(path, true)
        for(let fileName of dirList){
            const matchName = fileName;
            if(startsWithNumRegEx.test(fileName) && !seen.hasOwnProperty(matchName.match(startsWithNumRegEx)[0])){
                console.log("FILE NAME", fileName)
                const num = matchName.match(startsWithNumRegEx)[0];
                seen[num] = fileName;
            }
        }
        if(JSON.stringify(seen) !== '{}') {
            console.log("seeN exists")
            const createFoldersSuccess = creatFolders(path,seen);
            console.log("createFoldersSuccess",createFoldersSuccess)
            if(createFoldersSuccess){
                fetchDir(path);
            } else {
                alert("Arrror with creating new folders")
            }
        }
    } catch (err) {
    
       console.log("Sort Folder Catch ERROR:",err); 
    }
}

ipcRenderer.send('data', "ready");

// ipcRenderer.on('data', (e,args)=>{
//     console.log("data",args);
// })

// function openDialog(){
//     remote.dialog.showOpenDialog({properties:['openDirectory']}, (list)=>{
//      console.log("DIR LIST IN RENDERER", list);
//     });
// }

// ipcRenderer.on('fetchedDir', (e,args)=>{
//     console.log("fetch Dir",args);
//     if(args && args instanceof Array && args.length > 0){
//         const listElement = document.getElementById("dir-list");
//         listElement.innerHTML = '';
//         let htmlStr = ''
//         args.forEach((fileName)=>{
//             let icon = 'file';
//             if(!fileName.includes(".")){icon = 'folder'}
//             if(fileName.toLowerCase().includes(".pdf")){icon = 'file-pdf-o'}
//             if(fileName.toLowerCase().includes(".jpg")){icon = 'file-picture-o'}
//             if(fileName.toLowerCase().includes(".txt")){icon = 'file-word-o'}

//            const li =  `   <li fileName=${fileName}>
//                             <i class='fa fa-${icon}'></i> ${fileName}
//                             </li>
//                         `;
//             htmlStr+=li;            
//         });
//         listElement.innerHTML = htmlStr;
//         console.log("LIST",listElement);
//     }
// })
//const dialog = remote.dialog;

//dialog.showMessageBox({message:"this is a message from remote renderer", button:['OK']});
// new BrowserWindow({
//     width:200,
//     height:200
// })