const {dialog} = require('electron');
const ipc = require('../src/ipcController');
module.exports = [
    {
        label:"File",
        submenu:[
            {
                label:"Open",
                click:()=>{openDialog();}
            },
            {
              label:"Exit",
              role:'quit'
            },
        ]
      },
      {
        label:"Edit",
        submenu:[
            {
                label:"Undo",
                role:'undo'
            },
            {
                label:"Re-do",
                role:'redo'
            },
        ]
      },
      {
        label:"View",
        submenu:[
            {
                label:"Minimize",
                role:'minimize'
            },
            {
                label:"Close",
                role:'close'
            },
        ]
      },
      {
        label:"Help",
        submenu:[
            {
              label:"Greet",
              click:()=>{
                  console.log("greet was clicked");
              },
              accelerator:'Shift+Alt+g'
            },
            {
                label:"Random Option 2",
                submenu:[
                    {
                        label:"greet Bob",
                        click:()=>{
                            console.log('greet BBOB! hello bob.')
                        },
                        accelerator:'Shift+Alt+b'
                    }
                ],
                click:()=>{
                    console.log("option 2 clicked");
                }
            },
            {
                label:"Toggle Devloper Tools",
                role:"toggledevtools"
            }
        ]
      }
]