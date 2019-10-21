const {app, BrowserWindow } = require('electron');
let win;
var RecipeMap = new Map();
var fs = require('fs');
fs.open('recipeDatabase.txt', 'a+', function(err, file) {
    if (err) throw err;
});
 
class Recipe{
	constructor(name, ing, dir, orig, prep, course){
		this.recipename = name;
		this.ingredients = ing;
		this.directions = dir;
		this.origin = orig;
		this.prep = prep;
		this.course = course;
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
   
    var itemsret = [];
    //separting arguement to get the check box code and value typed into search field
    //checkbox = ingredients, recipename, preptime, origin, course
    var checkbox_code = arg.slice(0,5);
    var search = arg.slice(5);
    
    RecipeMap.forEach(function (item, index){   
git 
        //ingredients
        if(checkbox_code[0] === "1"){
            for(var i = 0; i < item.ingredients.length; i++){             
                if(item.ingredients[i] === search){
                    itemsret.push(item);
                }
            }
        }
        //recipe name         
        if(checkbox_code[1] === "1"){
            if(item.recipename === search){
                itemsret.push(item);
            }
        }

        //preptime
        if(checkbox_code[2] === "1"){
            if(item.prep >= search){
                itemsret.push(item);
            }
        }
        //origin
        if(checkbox_code[3] === "1"){
            if(item.origin === search){
                itemsret.push(item);
            }
        }
        //course
        if(checkbox_code[4] === "1"){
            if(item.course === search){
                itemsret.push(item);
            }
        }

    });

    //searches the map based on the directions and pushes matching items 
    //onto array
    //RecipeMap.forEach(function (item, index){
     //   for(var i = 0; i < item.directions.length; i++){             
      //      if(item.directions[i] === search){
        //        itemsret.push(item);
          //  }
       // }
    //});

    //removes duplicate items
    //inserts each element in hashtable after it checks for its existence
    //in the hash table
    var seen = {};
    var items_no_duplicates = [];
    items_no_duplicates = itemsret.filter(function(item) {
        return seen.hasOwnProperty(item.recipename)
        ? false : (seen[item.recipename] = true);
    });
 
    console.log(items_no_duplicates)
    //sends array of matching items to searchrecipe
    event.sender.send('recipe', items_no_duplicates);

})

//listens for a browse request
ipcMain.on('browse-request', (event, arg) => {
    if(RecipeMap.has(arg) == true){
            var displayrecipe = RecipeMap.get(arg)
            event.sender.send('recipe', displayrecipe);
    }
})


//listens for new recipe to add
ipcMain.on('recipe', (event, recipe_name, ingredients, directions, origin, prep, course) => {
    //if recipe name does not exist add it to the map
    if(RecipeMap.has(recipe_name) == false){
        let newrecipe = new Recipe(recipe_name, ingredients, directions, origin, prep, course);
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

            //if the map is empty send back a message saying so
            if (RecipeMap.size == 0){
                event.sender.send('random_recipe_return', 'empty');
                console.log(RecipeMap.size);
            }
            //if the map is not empty call random key function
            else{
                //call random recipe function and get random recipe key
                var recipe_key = getRandomKey(RecipeMap) 
                //send random recipe to random.js to display
                event.sender.send('random_recipe_return', RecipeMap.get(recipe_key));
            }
})

var map_iterator = RecipeMap.entries();
//event for handling random recipe request
//commenting out lots of code to try browse test
/*ipcMain.on('first_recipe', (event, arg) => {

    //if the map is empty send back a message saying so
    if (RecipeMap.size == 0){
        event.sender.send('first_recipe_return', 'empty');
        console.log(RecipeMap.size);
    }
    //if the map is not empty call random key function
    else{
        //call random recipe function and get random recipe key
        var recipe_key = map_iterator.next();
        //send random recipe to random.js to display
        event.sender.send('first_recipe_return', RecipeMap.get(recipe_key));
    }
})
*/


ipcMain.on('first_recipe', (event, arg) => {

    var displayrecipe = RecipeMap
    console.log(displayrecipe)
    var a = displayrecipe;
    event.sender.send('first_recipe', displayrecipe);
    

//event.sender.send('norecipe', 'No Recipe Exists')

})