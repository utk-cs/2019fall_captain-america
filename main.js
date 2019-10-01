const {app, BrowserWindow } = require('electron');
let win;
var RecipeMap = new Map();
var fs = require('fs');
fs.open('recipeDatabase.txt', 'a+', function(err, file) {
    if (err) throw err;
});
 
class Recipe{
	constructor(name, ing, dir){
		this.recipename = name;
		this.ingredients = ing;
		this.directions = dir;
	}
	get name(){
		return this.recipename;
	}
	set name(x){
		this.recipename = x;
	}
	get ings(){
		return this.ingredients;
	}
	set ing(x){
		this.ingredients = x;
	}
	get dirs(){
		return this.directions;
	}
	set dirs(x){
		this.directions = x;
	}
};

function writeMap(value, key, map) {
    fs.appendFile('recipeDatabase.txt', key + ': \n\t' + value.ingredients + '\n\t' + value.directions + '\n\n', function(err) {
        if (err) throw err;
    });
    console.log(`${key}: \n\t${value.ingredients}\n\t${value.directions}\n\n`);
}

app.on('ready', () => {
    // This creates a new BrowserWindow and sets win to be a reference to that new window.
    win = new BrowserWindow({
        width: 600, // Sets the width by pixel count
        height: 400, // Sets the height by pixel count
        webPreferences: {
            nodeIntegration: true, // This ie extremely important later, but is not used in this example.
            devTools: true,
        }
    });
    // This is a method of a BrowserWindow that lets you load an html file to view.
    win.loadFile('basic.html');

    win.on('close', () => {
        RecipeMap.forEach(writeMap);
        win = null;
    });
});

//event listener
const { ipcMain } = require('electron')

//listens for event "search request"
//gets passed arg which is the text in the search request
ipcMain.on('search-request', (event, arg) => {
    //if the map contains the specified recipe send back the data
    if(RecipeMap.has(arg) == true){
            var displayrecipe = RecipeMap.get(arg)
            event.sender.send('recipe', displayrecipe);
        }
    //else send an message saying the recipe does not exist
    else{
    event.sender.send('norecipe', 'No Recipe Exists')
    }
})

//listens for a browse request
ipcMain.on('browse-request', (event, arg) => {
    if(RecipeMap.has(arg) == true){
            var displayrecipe = RecipeMap.get(arg)
            event.sender.send('recipe', displayrecipe);
    }
})


//listens for new recipe to add
ipcMain.on('recipe', (event, recipe_name, ingredients, directions) => {
    //if recipe name does not exist add it to the map
    if(RecipeMap.has(recipe_name) == false){
        let newrecipe = new Recipe(recipe_name, ingredients, directions);
        RecipeMap.set(recipe_name, newrecipe);
        event.sender.send('recipe_exists', false);
    }
    //if it does exist send back an error
    else{
        event.sender.send('recipe_exists', true);
    }
})

//event for logging message on the console for debugging
ipcMain.on('log' , (event, arg) => {
    console.log(arg)
})

//function that gets a random key from the recipe map
function getRandomKey(collection) {
    let keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
}

//event for handling random recipe request
ipcMain.on('random_recipe', (event, arg) => {
            //call random recipe function and get random recipe key
            var recipe_key = getRandomKey(RecipeMap) 
            //send random recipe to random.js to display
            event.sender.send('random_recipe_return', RecipeMap.get(recipe_key));
            console.log(RecipeMap.get(recipe_key));
})

