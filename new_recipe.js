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
    
    /*let ingredients = [];
    let directions = [];
    let i = 1;
    let ing = "ingredients";
    let dir = "directions";
	 
    while(document.getElementById(str.concat(ing, i.toString())).value != null){
	ingredients[i-1] = document.getElementById(str.concat(ing, i.toString())).value;
	i++;
    }
    
    i = 1;

    while(document.getElementById(str.concat(dir, i.toString())).value != null){
    	directions[i-1] = document.getElementById(str.concat(dir, i.toString())).value;
	i++;
    }	    
	*/
    let ingredients = document.getElementById('ingredients').value;
    let directions = document.getElementById('directions').value;
    ipcRenderer.send('recipe', recipe_name, ingredients, directions);
})
