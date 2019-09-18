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

//listens for add recipe button to be clicked
//gets values out of text fields and sends them to main
document.getElementById('add_recipe').addEventListener('click', function(){
    let recipe_name = document.getElementById('recipe_name').value;
    let ingredients = document.getElementById('ingredients').value;
    let directions = document.getElementById('directions').value;
    ipcRenderer.send('recipe', recipe_name + "  " + directions+ " " + ingredients);
})
