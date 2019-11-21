const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');

ipcRenderer.send('display_recipe_ready', "ready");

ipcRenderer.on('random_recipe_return', (event, arg ) => {

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
	
	if(arg.origin != ""){
	  origin.textContent = "Origin: " + arg.origin;
	}
	else{
	  origin.textContent = "Origin: N/A";
	}
	if(arg.prep != ""){
	  prep.textContent = "Prep Time: " + arg.prep;
	}
	else{
	  prep.textContent = "Prep Time: N/A";
	}
	if(arg.course != ""){
	  course.textContent = "Course: " + arg.course;
	}
	else{
	  course.textContent = "Course: N/A";
	}

	if (arg.img != "") img.innerHTML = "<img src = images/" +  arg.img + ' width="512" height="360"> </img>';
	else  img.innerHTML = "";
	
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
})
