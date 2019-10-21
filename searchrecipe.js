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
    let origin = document.getElementById('origin');
    let prep = document.getElementById('prep');
    let course = document.getElementById('course');
    let ingString = '';
    let dirString = '';

    recipename.textContent = arg.recipename;
    origin.textContent = arg.origin;
    prep.textContent = arg.prep;
    course.textContent = arg.course;

    for(let i = 0; i < arg.ingredients.length; i++){
	if(i == arg.ingredients.length - 1){
	    ingString += arg.ingredients[i];	   
	}
	else{
	    ingString += arg.ingredients[i] + ", ";
    	}
    }
    ingredients.textContent = ingString;
    //ingredients.textContent = "Ingredients: " + arg.ingredients;
    
    for(let i = 0; i < arg.directions.length; i++){
	if(i == arg.directions.length - 1){
	    dirString += arg.directions[i];
	}
	else{
	    dirString += arg.directions[i] + ", ";
        }
    }
    directions.textContent = dirString;	
    //directions.textContent = "Directions: " + arg.directions; 
})
ipcRenderer.on('norecipe', (event, arg ) => {
    let recipename = document.getElementById('recipename');
    let ingredients = document.getElementById('ingredients');
    let directions = document.getElementById('directions');
    let origin = document.getElementById('origin');
    let prep = document.getElementById('prep');
    let course = document.getElementById('course');
    recipename.textContent = arg;
    origin.textContent = "";
    prep.textContent = "";
    course.textContent = "";
    ingredients.textContent = "";
    directions.textContent = "";
})
//gets text in the search bar upon click and sends it to main
document.getElementById('search-request').addEventListener('click', function(){
    let search = document.getElementById('search').value;
    let ingredients_checkbox = document.getElementById('ingredient_checkbox').checked;
    let recipename_checkbox = document.getElementById('recipename_checkbox').checked;
    //creating a checkbox code for to append to the search string so that the search funciton
    //knows which values to search for
    //checkbox_code = "ingredient checkbox value, recipe_name checkbox value"
    var checkbox_code = "";
    if(ingredients_checkbox === true) 
        checkbox_code = checkbox_code + "1";
    else{
        checkbox_code = checkbox_code + "0";
    }
    if(recipename_checkbox === true) 
        checkbox_code = checkbox_code + "1";
    else{
        checkbox_code = checkbox_code + "0";
    }
    //if no checkbox is selected search by everything
    if(checkbox_code === "00") checkbox_code = "11";
    ipcRenderer.send('search-request', checkbox_code + search);
    console.log(checkbox_code + search);
})

//listens for event "search request"
//gets passed arg which is the text in the search request
ipcMain.on('search-request', (event, arg) => {
    if(RecipeMap.has(arg) == true){
            var displayrecipe = RecipeMap.get(arg)
            console.log(displayrecipe.ingredients)
            var a = displayrecipe.ingredients;
            event.sender.send('recipe', displayrecipe);
        }
    else{
    event.sender.send('norecipe', 'No Recipe Exists')
    }
})
