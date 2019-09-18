const {app, BrowserWindow } = require('electron');
let win;

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
        win = null;
    });
});

//event listener
const { ipcMain } = require('electron')

//listens for event "search request"
//gets passed arg which is the text in the search request
ipcMain.on('search-request', (event, arg) => {
    console.log(arg)
    event.sender.send('response', 'received')
})

//listens for new recipe to add
ipcMain.on('recipe', (event, recipe_name, ingredients, directions) => {
    console.log(recipe_name)
    console.log(ingredients)
    console.log(directions)
    let newrecipe = new Recipe(recipe_name, ingredients, directions);
    console.log(newrecipe.name);
    console.log(newrecipe.ingredients);
    console.log(newrecipe.directions);
    event.sender.send('response', 'received')
})

//event for logging message on the console for debugging
ipcMain.on('log' , (event, arg) => {
    console.log(arg)
})
