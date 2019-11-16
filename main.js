const {app, BrowserWindow } = require('electron');
let win;
var RecipeMap = new Map();
var fs = require('fs');
fs.open('recipeDatabase.txt', 'r+', function(err, file) {
    if (err) throw err;
});
 
class Recipe{
	constructor(name, ing, dir, orig, prep, course, img){
		this.recipename = name;
		this.ingredients = ing;
		this.directions = dir;
		this.origin = orig;
		this.prep = prep;
        this.course = course;
        this.img = img;
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

function readTextFile(file) {
    try {
        var data = fs.readFileSync(file, 'utf8').toString().split('\n');
        //console.log(data);
        //console.log(data.length);
    } catch(e) {
        console.log('error:', e.stack);
    }
    
    if (data[0] != '') { // if its an empty file there's nothing to read
        for (var i = 0; i < data.length; i++) {
            if (data[i] == '') break; // there's always an extra line at the end of the file
            let recipe_name = data[i];
            i++;
            //if (i >= data.length) break; // error checking? in case the file is formatted incorrectly?
            let origin = data[i];
            i++;
            //if (i >= data.length) break;
            let prep = data[i];
            i++;
            //if (i >= data.length) break;
            let course = data[i];
            i++;
            //if (i >= data.length) break;
            let img = data[i];
            i++;
            //if (i >= data.length) break;
            let ingredients = data[i].split(',');
            i++;
            //if (i >= data.length) break;
            let directions = data[i].split(',');
            i++;
            //if (i >= data.length) break;
            //i++; // this last one is for the blank line(s?) that separates recipes

            let newrecipe = new Recipe(recipe_name, ingredients, directions, origin, prep, course, img);
            RecipeMap.set(recipe_name, newrecipe);
            //console.log(newrecipe);
        }
    }
    /*fs.readTextFile(file, 'utf8', function(err, contents) {
        if (err) throw err;
        console.log(contents);
        console.log(file.length);
    });*/
}

function writeMap(map) {
    fs.writeFile('recipeDatabase.txt', '', function(err) { // clear the file because we're about to rewrite it
        if (err) throw err;
    });
    map.forEach(writeRecipe);
}

function writeRecipe(value, key, map) {
    fs.appendFileSync('recipeDatabase.txt', key + '\n' + value.origin + '\n' + value.prep + '\n' + value.course + '\n' + value.img + '\n' + value.ingredients + '\n' + value.directions + '\n\n', function(err) {
        if (err) throw err;
    });
}

app.on('ready', () => {
    // read in the file and sets up the map with previously saved recipes
    readTextFile('./recipeDatabase.txt');

    // This creates a new BrowserWindow and sets win to be a reference to that new window.
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true, // This ie extremely important later, but is not used in this example.
            devTools: true,
        }
    });
    win.maximize();
    // This is a method of a BrowserWindow that lets you load an html file to view.
    win.loadFile('basic.html');

    win.on('close', () => {
        console.log(RecipeMap);
        writeMap(RecipeMap);
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
        //ingredients
        if(checkbox_code[0] === "1"){
            for(var i = 0; i < item.ingredients.length; i++){  
                var string1 = item.ingredients[i].toUpperCase();
                var string2 = search.toUpperCase();           
                if(string1.includes(string2)){
                    itemsret.push(item);
                }
            }
        }
        //recipe name         
        if(checkbox_code[1] === "1"){
            var string1 = item.recipename.toUpperCase();
            var string2 = search.toUpperCase();    
            if(string1.includes(string2)){
                itemsret.push(item);
            }
        }

        //preptime
        if(checkbox_code[2] === "1"){
            if(item.prep <= search){
                itemsret.push(item);
            }
        }
        //origin
        if(checkbox_code[3] === "1"){
            var string1 = item.origin.toUpperCase();
            var string2 = search.toUpperCase();  
            if(string1.includes(string2)){
                itemsret.push(item);
            }
        }
        //course
        if(checkbox_code[4] === "1"){
            var string1 = item.course.toUpperCase();
            var string2 = search.toUpperCase();  
            if(string1.includes(string2)){
                itemsret.push(item);
            }
        }

    });

    //removes duplicate items
    //inserts each element in hashtable after it checks for its existence
    //in the hash table
    var seen = {};
    var items_no_duplicates = [];
    items_no_duplicates = itemsret.filter(function(item) {
        return seen.hasOwnProperty(item.recipename)
        ? false : (seen[item.recipename] = true);
    });
 
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
ipcMain.on('recipe', (event, recipe_name, ingredients, directions, origin, prep, course, img) => {
    //if recipe name does not exist add it to the map
    if(RecipeMap.has(recipe_name) == false){
        let newrecipe = new Recipe(recipe_name, ingredients, directions, origin, prep, course, img);
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


ipcMain.on('first_recipe', (event, arg) => {
    var imsorry = [];
    RecipeMap.forEach(function (item, index){ 
        imsorry.push(item);
    })
    event.sender.send('first_recipe', imsorry);
})
 
var display_recipe;
ipcMain.on('display_recipe', (event, arg) => {
    win.loadFile('display_recipe.html');
    display_recipe = arg; 
})

ipcMain.on('addEvent', (event, arg) => {
    var recipenames = [];
    RecipeMap.forEach(function (item, index){
	recipenames.push(index);
    })
    event.sender.send('addEvent', recipenames);
}

ipcMain.on('display_recipe_ready', (event, arg) => {
    event.sender.send('random_recipe_return', display_recipe);
})
