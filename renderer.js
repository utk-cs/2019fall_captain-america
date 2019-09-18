//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//when main sends back a response message it will be received here
ipcRenderer.on('response', (event, arg) => {
    console.log("HTTP response received: " + arg)
})

//sending the event "search request" to main when button is clicked
console.log(ipcRenderer.send('search-request', "this is a search"))

console.log("starting renderer process")