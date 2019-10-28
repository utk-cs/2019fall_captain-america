//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

//when main sends back a response message it will be received here
//listens for button to be clicked and requests data form main
document.getElementById('display_first_recipe').addEventListener('click', function(){
    ipcRenderer.send('first_recipe', "");
})
//displays random recipe into html file
ipcRenderer.on('first_recipe', (event, arg ) => {

	log(arg[0].recipename);
	console.log(arg);
})
