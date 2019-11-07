//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

//If the recipe name already exists, it will throw an error here
ipcRenderer.on('recipe_exists', (event, arg) => {
    let recipe_exists = document.getElementById('recipe_exists');
    if(arg === true){
        recipe_exists.textContent = 'Recipe already exists enter in new recipe name';
    	var elements = document.getElementsByTagName("input");
	for (var i=0; i < elements.length; i++) {
		elements[i].value = "";
	}
    }
    else{
        recipe_exists.textContent = 'Recipe added successfully';
    	var elements = document.getElementsByTagName("input");
	for (var i=0; i < elements.length; i++) {
            elements[i].value = "";
	}
    }
})

//listens for add recipe button to be clicked
//gets values out of text fields and sends them to main
document.getElementById('add_recipe').addEventListener('click', function(){
    let recipe_name = document.getElementById('recipe_name').value;
    
    let ingredients = [];
    let directions = [];
    let ing = 'ingredients'; 
    let dir = 'directions';
    let i = 1;
    let ingString = ing.concat(i.toString());
    let dirString = dir.concat(i.toString());

    let origin = document.getElementById('origin').value;
    let prep = document.getElementById('prep').value;
    let course = document.getElementById('course').value;
    let img = document.getElementById('img').value.replace("C:\\fakepath\\", "");
    //let img = document.getElementById('img').value
    
    while(document.getElementById(ingString).value !== ''){
	ingredients[i-1] = document.getElementById(ingString).value;
	i++;

	if(i > 10){
		break;
	}

	ingString = ing.concat(i.toString());
    }

    i = 1;
    
    while(document.getElementById(dirString).value !== ''){    
	directions[i-1] = document.getElementById(dirString).value;
        i++;

	if(i > 10){
		break;
	}

	dirString = dir.concat(i.toString());
    }
    ipcRenderer.send('recipe', recipe_name, ingredients, directions, origin, prep, course, img);
})
