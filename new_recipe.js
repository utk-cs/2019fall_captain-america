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
	 
    ingredients[0] = document.getElementById('ingredients').value;
    ingredients[1] = document.getElementById('ingredients2').value;
    ingredients[2] = document.getElementById('ingredients3').value;
    ingredients[3] = document.getElementById('ingredients4').value;

    directions[0] = document.getElementById('directions').value;
    directions[1] = document.getElementById('directions2').value;
    directions[2] = document.getElementById('directions3').value;
    directions[3] = document.getElementById('directions4').value;
	
   // let ingredients = document.getElementById('ingredients').value;
    //let directions = document.getElementById('directions').value;
    ipcRenderer.send('recipe', recipe_name, ingredients, directions);
})
