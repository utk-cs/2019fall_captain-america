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
    
    let ingredients = [];
    let directions = [];
    let ing = 'ingredients'; 
    let dir = 'directions';
    let i = 1;
    let ingString = ing.concat(i.toString());
    let dirString = dir.concat(i.toString());

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

   // let ingredients = document.getElementById('ingredients').value;
    //let directions = document.getElementById('directions').value;
    ipcRenderer.send('recipe', recipe_name, ingredients, directions);
})
