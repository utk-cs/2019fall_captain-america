//file that renderers events and sends them to main
const { ipcRenderer } = require('electron')

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}
let prefix = "Recipe: "; 
//when main sends back a response message it will be received here
ipcRenderer.on('recipe', (event, arg ) => {

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
    }

    else{ 

        //making headings
        var tr = document.createElement('tr');
        var cell1 = document.createElement('td');
        var cell2 = document.createElement('td');
        var cell3 = document.createElement('td');
        cell1.innerHTML = "Recipe Name";
        cell2.innerHTML = "Ingredients";
        cell3.innerHTML = "Directions";
        tr.appendChild(cell1);
        tr.appendChild(cell2);
        tr.appendChild(cell3);
        table.appendChild(tr);
        
        //for every recipe returned make a new table row
        for(var i = 0; i < arg.length; i++){
            let ingString = '';
            let dirString = '';
            var tr = document.createElement('tr');
            var cell1 = document.createElement('td');
            var cell2 = document.createElement('td');
            var cell3 = document.createElement('td');
        
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
            cell1.innerHTML = arg[i].recipename;
            cell2.innerHTML = ingString;
            cell3.innerHTML = dirString;
            
            //add rows to the table
            tr.appendChild(cell1);
            tr.appendChild(cell2);
            tr.appendChild(cell3);
            table.appendChild(tr);
        }
    }
})


//gets text in the search bar upon click and sends it to main
document.getElementById('search-request').addEventListener('click', function(){
    let search = document.getElementById('search').value;
    let ingredients_checkbox = document.getElementById('ingredient_checkbox').checked;
    let recipename_checkbox = document.getElementById('recipename_checkbox').checked;
    
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
    //if no checkbox is selected search by everything
    if(checkbox_code === "00") checkbox_code = "11";
    ipcRenderer.send('search-request', checkbox_code + search);
    console.log(checkbox_code + search);
})

//listens for event "search request"
//gets passed arg which is the text in the search request
ipcMain.on('search-request', (event, arg) => {
    if(RecipeMap.has(arg) == true){
            var displayrecipe = RecipeMap.get(arg)
            console.log(displayrecipe.ingredients)
            var a = displayrecipe.ingredients;
            event.sender.send('recipe', displayrecipe);
        }
    else{
    event.sender.send('norecipe', 'No Recipe Exists')
    }
})
