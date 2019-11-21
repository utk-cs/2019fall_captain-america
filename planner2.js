const{ ipcRenderer } = require('electron');
const{ remote } = require('electron');
currWindow = remote.getCurrentWindow();
window.$ = window.jQuery = require('jquery');

ipcRenderer.on('addEvent', (event, arg ) => {
  console.log("in event function");
  if(arg.length === 0){
    var empty = document.createElement("div");
    empty.innerHTML = "No recipes added yet";
    document.form.appendChild(empty);
  }
  else{
    for(var i = 0; i < arg.length; i++){
      var newRecipe = document.createElement("div");
      newRecipe.innerHTML = arg[i];
      document.getElementById("buttons").appendChild(newRecipe);
    }
  }
})
