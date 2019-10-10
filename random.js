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

    //if there are no recipes added yet, display a message 
    if(arg === 'empty'){
        let recipename = document.getElementById('recipename');
        let ingredients = document.getElementById('ingredients');
        let directions = document.getElementById('directions');
        let origin = document.getElementById('origin');
	recipename.textContent = "No recipes added yet";
        ingredients.textContent = "";
        directions.textContent = ""; 
    }
    
    //if there are recipes, then display the recipe
    else{
        let recipename = document.getElementById('recipename');
        let ingredients = document.getElementById('ingredients');
        let directions = document.getElementById('directions');
        let origin = document.getElementById('origin');
	recipename.textContent = arg.recipename;
	origin.textContent = arg.origin;
        ingredients.textContent = "Ingredients: " + arg.ingredients;
        directions.textContent = "Directions: " + arg.directions;
    } 
})
