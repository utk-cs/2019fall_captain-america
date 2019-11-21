//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')
const { remote } = require('electron'),
currWindow   = remote.getCurrentWindow();
window.$ = window.jQuery = require('jquery');


//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

var returnarr;


//when main sends back a response message it will be received here
//listens for button to be clicked and requests data form main
document.getElementById('display_first_recipe').addEventListener('click', function(){
    ipcRenderer.send('first_recipe', "");
})
//displays random recipe into html file
ipcRenderer.on('first_recipe', (event, arg ) => {
    
    //getting a handle on the table and clearing it
    let table = document.getElementById('tableId');
    table.innerHTML = "";
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
        var cell0 = document.createElement('td');
	    var cell1 = document.createElement('td');
        var cell2 = document.createElement('td');
        //var cell3 = document.createElement('td');
        var cell4 = document.createElement('td');
        var cell5 = document.createElement('td');
        var cell6 = document.createElement('td');
	    cell0.innerHTML = "";
        cell1.innerHTML = "Recipe Name";
        cell2.innerHTML = "Ingredients";
        //cell3.innerHTML = "       ";
        cell4.innerHTML = "Origin";
        cell5.innerHTML = "Prep-time";
        cell6.innerHTML = "Course";
	    tr.appendChild(cell0);    
        tr.appendChild(cell1);
        tr.appendChild(cell2);
        //tr.appendChild(cell3);
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
            //var direction_cell = document.createElement('td');
            var origin_cell = document.createElement('td');
            var preptime_cell = document.createElement('td');
            var course_cell = document.createElement('td');
        
            //origin.textContent = arg[i].origin;
            //prep.textContent = arg[i].prep;
            //course.textContent = arg[i].course;

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
            if (arg[i].img != "") image_cell.innerHTML = "<img src = 'images/" + arg[i].img + " 'width = 128px height = 128px> </img>";
            else image_cell.innerHTML = "";
            recipe_cell.innerHTML = arg[i].recipename;
            ingredient_cell.innerHTML = ingString;
            //direction_cell.innerHTML = dirString;
            origin_cell.innerHTML = arg[i].origin;
            preptime_cell.innerHTML = arg[i].prep;
            course_cell.innerHTML = arg[i].course;
            
            //add rows to the table
	        tr.appendChild(image_cell);
            tr.appendChild(recipe_cell);
            tr.appendChild(ingredient_cell);
            //tr.appendChild(direction_cell);
            tr.appendChild(origin_cell);
            tr.appendChild(preptime_cell);
            tr.appendChild(course_cell);
            table.appendChild(tr);
        }
    }
})


$("#tableId").on('click', 'tr', function() {
    var rowid = this.id;
    if(rowid !== "title"){
        ipcRenderer.send('display_recipe', returnarr[rowid], 1);
    }
});