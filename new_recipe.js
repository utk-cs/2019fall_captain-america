//file that renderers events and sends them to main
const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');

//sends message to main for debugging
function log(message){
    ipcRenderer.send('log', message)
}

//listens for add recipe button to be clicked
//gets values out of text fields and sends them to main
document.getElementById('add_recipe').addEventListener('click', function(){
    var directions = [];
    var ingredients = [];
    var recipe_exists = document.getElementById("snackbar");
    recipe_exists.className = "show";
    setTimeout(function () { recipe_exists.className = recipe_exists.className.replace("show", ""); }, 3000);

    var j = 0;
    $.each($('.dir_text'), function(i, item) {
        if($(item).val() !== null){
             directions[j] = $(item).val(); 
            j = j + 1;
        }
    });

    j = 0;
    $.each($('.ing_text'), function(i, item) {
        if($(item).val() !== null){
             ingredients[j] = $(item).val(); 
            j = j + 1;
        }
    });

    let recipe_name = document.getElementById('recipe_name').value;
    let origin = document.getElementById('origin').value;
    let prep = document.getElementById('prep').value;
    let course = document.getElementById('course').value;
    let img = document.getElementById('img').value.replace("C:\\fakepath\\", "");
    //let img = document.getElementById('img').value
    
    recipe_exists.textContent = ipcRenderer.sendSync('recipe', recipe_name, ingredients, directions, origin, prep, course, img);
    // if user needs to enter recipe name, dont clear the fields
    if (recipe_exists.textContent != "Please enter recipe name") {
        var elements = document.getElementsByTagName("input");
        for (var i=0; i < elements.length; i++) {
            elements[i].value = "";
        }
    }
})

$(document).ready(function() {
	var max_fields      = 10; //maximum input boxes allowed
	var wrapper   		= $(".input_fields_wrap"); //Fields wrapper
	var add_button      = $(".add_field_button"); //Add button ID
	
	var x = 1; //initlal text box count
	$(add_button).click(function(e){ //on add input button click
		e.preventDefault();
		if(x < max_fields){ //max input box allowed
			x++; //text box increment
			$(wrapper).append('<div><input type="text" class = "dir_text"/><a href="#" class="remove_field" style="color: rgb(150, 1, 28);">Remove</a></div>'); //add input box
		}
	});
	
	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});

$(document).ready(function() {
	var max_fields      = 10; //maximum input boxes allowed
	var wrapper   		= $(".input_fields_wrap1"); //Fields wrapper
	var add_button      = $(".add_field_button1"); //Add button ID
	
	var x = 1; //initlal text box count
	$(add_button).click(function(e){ //on add input button click
		e.preventDefault();
		if(x < max_fields){ //max input box allowed
			x++; //text box increment
			$(wrapper).append('<div><input type="text" class = "ing_text"/><a href="#" class="remove_field" style="color: rgb(150, 1, 28);">Remove</a></div>'); //add input box
		}
	});
	
	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});