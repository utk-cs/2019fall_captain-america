const {app, BrowserWindow } = require('electron');
let win;

app.on('ready', () => {
    // This creates a new BrowserWindow and sets win to be a reference to that new window.
    win = new BrowserWindow({
        width: 600, // Sets the width by pixel count
        height: 400, // Sets the height by pixel count
        webPreferences: {
            nodeIntegration: true // This ie extremely important later, but is not used in this example.
        }
    });
    // This is a method of a BrowserWindow that lets you load an html file to view.
    win.loadFile('basic.html');

    win.on('close', () => {
        win = null;
    });
});