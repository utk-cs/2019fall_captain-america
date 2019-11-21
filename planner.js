//placeholder file for the js needed for meal planner
const { ipcRenderer } = require('electron');

document.getElementById('mealPlanner').addEventListener('click', function(){
	ipcRenderer.send('Planner', "");
})
