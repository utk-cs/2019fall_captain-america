//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

let prefix = "Recipe: "; 
//when main sends back a response message it will be received here
ipcRenderer.on('recipe', (event, arg ) => {
    console.log("response received: " + arg);
    let recipename = document.getElementById('recipename');
    let ingredients = document.getElementById('ingredients');
    let directions = document.getElementById('directions');
    recipename.textContent = arg.recipename;
    ingredients.textContent = "Ingredients: " + arg.ingredients;
    directions.textContent = "Directions: " + arg.directions; 
})

//gets text in the search bar upon click and sends it to main
document.getElementById('search-request').addEventListener('click', function(){
    let search = document.getElementById('search').value;
    ipcRenderer.send('search-request', search);
})