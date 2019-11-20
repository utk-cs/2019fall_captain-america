//file that renderers events and sends them to main
const { ipcRenderer } = require('electron');
const { remote } = require('electron'),
currWindow   = remote.getCurrentWindow();
window.$ = window.jQuery = require('jquery');

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}


var returnarr;
$( document ).ready(function() {
    ipcRenderer.send('redirect');
});

//when main sends back a response message it will be received here
ipcRenderer.on('recipe', (event, arg ) => {
    last_table = arg; 
    //getting a handle on the table and clearing it
    let table = document.getElementById('tableId');
    table.innerHTML = "";
    //if no elements in array, display no elements
    if(arg.length === 0){
        var tr = document.createElement('tr');
        var cell1 = document.createElement('td');
        cell1.innerHTML = "No recipes found";
        tr.appendChild(cell1);
        table.appendChild(tr);
        returnarr = arg;
    }

    else{ 
        returnarr = arg;
        //making headings
        var tr = document.createElement('tr');
        var cell0 = document.createElement('th');
        var cell1 = document.createElement('th');
        var cell2 = document.createElement('th');
        var cell3 = document.createElement('th');
        var cell4 = document.createElement('th');
        var cell5 = document.createElement('th');
        var cell6 = document.createElement('th');
        cell0.innerHTML = "";
        cell1.innerHTML = "Recipe Name";
        cell2.innerHTML = "Ingredients";
        cell3.innerHTML = "Directions";
        cell4.innerHTML = "Origin";
        cell5.innerHTML = "Prep-time";
        cell6.innerHTML = "Course";
        tr.appendChild(cell0);
        tr.appendChild(cell1);
        tr.appendChild(cell2);
        tr.appendChild(cell3);
        tr.appendChild(cell4);
        tr.appendChild(cell5);
        tr.appendChild(cell6);
        tr.id = "title";
        table.appendChild(tr);
        
        //for every recipe returned make a new table row
        for(var i = 0; i < arg.length; i++){
            let ingString = '';
            let dirString = '';
            var tr = document.createElement('tr');
            tr.id = i;
            var image_cell = document.createElement('td');
            var recipe_cell = document.createElement('td');
            var ingredient_cell = document.createElement('td');
            var direction_cell = document.createElement('td');
            var origin_cell = document.createElement('td');
            var preptime_cell = document.createElement('td');
            var course_cell = document.createElement('td');
        

            //parse out ingredients string
            for(let j = 0; j < arg[i].ingredients.length; j++){
	            if(j == arg[i].ingredients.length - 1){
	                ingString += arg[i].ingredients[j];	   
	            }
	            else{
	                ingString += arg[i].ingredients[j] + ", ";
    	        }
            }
            //parse out directions string    
            for(let j = 0; j < arg[i].directions.length; j++){
	            if(j == arg[i].directions.length - 1){
	                dirString += arg[i].directions[j];
	            }
	            else{
	                dirString += arg[i].directions[j] + ", ";
                }
            }	
   
            //fill cells with appropriate data
            recipe_cell.innerHTML = arg[i].recipename;
            ingredient_cell.innerHTML = ingString;
            direction_cell.innerHTML = dirString;
            origin_cell.innerHTML = arg[i].origin;
            preptime_cell.innerHTML = arg[i].prep;
            course_cell.innerHTML = arg[i].course;
            //blake breaking images here uncomment below line to fix
            image_cell.innerHTML = "<img src = 'images/" + arg[i].img + "' width = 128px height = 128px> </img>";
            //image_cell.innerHTML = "<img src =" + arg[i].img + "' width = 128px height = 128px> </img>";
            //add rows to the table
            tr.appendChild(image_cell);
            tr.appendChild(recipe_cell);
            tr.appendChild(ingredient_cell);
            tr.appendChild(direction_cell);
            tr.appendChild(origin_cell);
            tr.appendChild(preptime_cell);
            tr.appendChild(course_cell);
            table.appendChild(tr);
        }
    }
})

//gets text in the search bar upon click and sends it to main
document.getElementById('search-request').addEventListener('click', function(){
    let search = document.getElementById('search').value;
    let ingredients_checkbox = document.getElementById('ingredient_checkbox').checked;
    let recipename_checkbox = document.getElementById('recipename_checkbox').checked;
    let preptime_checkbox = document.getElementById('preptime_checkbox').checked;
    let origin_checkbox = document.getElementById('origin_checkbox').checked;
    let course_checkbox = document.getElementById('course_checkbox').checked;
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
    if(preptime_checkbox === true) 
        checkbox_code = checkbox_code + "1";
    else{
        checkbox_code = checkbox_code + "0";
    }
    if(origin_checkbox === true) 
        checkbox_code = checkbox_code + "1";
    else{
        checkbox_code = checkbox_code + "0";
    }
    if(course_checkbox === true) 
        checkbox_code = checkbox_code + "1";
    else{
        checkbox_code = checkbox_code + "0";
    }
    
    //if no checkbox is selected search by everything
    if(checkbox_code === "00000") checkbox_code = "11111";
    ipcRenderer.send('search-request', checkbox_code + search);
})



$("#tableId").on('click', 'tr', function() {
    var rowid = this.id;
    log(returnarr[rowid]);
    if(rowid !== "title"){
        ipcRenderer.send('display_recipe', returnarr[rowid], returnarr);
    }
});

