//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

//listens for button to be clicked and requests data form main
document.getElementById('display_random_recipe').addEventListener('click', function(){
    ipcRenderer.send('random_recipe', "");
})
//displays random recipe into html file
ipcRenderer.on('random_recipe_return', (event, arg ) => {
    let recipename = document.getElementById('recipename');
    let ingredients = document.getElementById('ingredients');
    let directions = document.getElementById('directions');
    recipename.textContent = arg.recipename;
    ingredients.textContent = "Ingredients: " + arg.ingredients;
    directions.textContent = "Directions: " + arg.directions; 
})