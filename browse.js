//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

let prefix = "Recipe: "; 
//when main sends back a response message it will be received here
//listens for button to be clicked and requests data form main
document.getElementById('display_first_recipe').addEventListener('click', function(){
    ipcRenderer.send('first_recipe', "");
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
	origin.textContent = "";
        ingredients.textContent = "";
        directions.textContent = ""; 
    }
    
    //if there are recipes, then display the recipe
    else{
        let recipename = document.getElementById('recipename');
        let ingredients = document.getElementById('ingredients');
        let directions = document.getElementById('directions');
        let origin = document.getElementById('origin');
	let ingString = '';
	let dirString = '';
	recipename.textContent = arg.recipename;
        origin.textContent = arg.origin;

	for(let i = 0; i < arg.ingredients.length; i++){
	    if(i == arg.ingredients.length - 1){
		ingString += arg.ingredients[i];
	    }
	    else{
		ingString += arg.ingredients[i] + ", ";
	    }
	}
	ingredients.textContent = "Ingredients: " + ingString; 
	//ingredients.textContent = "Ingredients: " + arg.ingredients;
        
	for(let i = 0; i < arg.directions.length; i++){
	    if(i == arg.directions.length - 1){
		dirString += arg.directions[i];
	    }
	    else{
		dirString += arg.directions[i] + ", ";
	    }
	}
	directions.textContent = "Directions: " + dirString;
	//directions.textContent = "Directions: " + arg.directions;
    } 
