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
		let prep = document.getElementById('prep');
		let course = document.getElementById('course');
		let img = document.getElementById('img');
		recipename.textContent = "No recipes added yet";
        ingredients.textContent = "";
        directions.textContent = ""; 
        origin.textContent = "";
		prep.textContent = "";
		course.textContent = "";
    }
    
    //if there are recipes, then display the recipe
    else{
        let recipename = document.getElementById('recipename');
        let ingredients = document.getElementById('ingredients');
        let directions = document.getElementById('directions');
        let origin = document.getElementById('origin');
		let prep = document.getElementById('prep');
		let course = document.getElementById('course');
		let ingString = "";
		let dirString = "";
		let img = document.getElementById('img');
		recipename.textContent = arg.recipename;
		origin.textContent = "Origin: " + arg.origin;
		prep.textContent = "Prep Time: " + arg.prep;
		course.textContent = "Course: " + arg.course;
		img.innerHTML = "<img src = images/" +  arg.img + ' width="128" height="128"> </img>'
		console.log(img);
	    
        for(let i = 0; i < arg.ingredients.length; i++){
			if(i == arg.ingredients.length - 1){
				ingString += arg.ingredients[i];
			}
			else{
				ingString += arg.ingredients[i] + ", ";
			}
		}
	ingredients.textContent = "Ingredients: " + ingString;

		for(let i = 0; i < arg.directions.length; i++){
			if(i == arg.directions.length - 1){
			dirString += arg.directions[i];
			}
			else{
			dirString += arg.directions[i] + ", ";
			}
		}
		
        directions.textContent = "Directions: " + dirString;
    } 
})
