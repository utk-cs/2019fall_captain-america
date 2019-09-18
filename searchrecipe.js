//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

//when main sends back a response message it will be received here
ipcRenderer.on('response', (event, arg) => {
    console.log("response received: " + arg)
})

//gets text in the search bar upon click and sends it to main
document.getElementById('search-request').addEventListener('click', function(){
    let search = document.getElementById('search').value;
    ipcRenderer.send('search-request', search);
})
