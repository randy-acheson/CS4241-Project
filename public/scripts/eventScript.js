var audio;
var playPause;
var header;
var subtitle;
var dBody;
var playPauseSwitch;
var counter;
var squares;
var secretSquare;
var originalTableSize;


function buildTable(numSquaresPerRow, alternateShapes) {
	var cells = [];
	var rows = [];
	var id;
	var shapes = ["&#x25A0;", "&#x25B2;"]; //[0] is a square, [1] is a triangle
	var shapeIndex = 0;
	var randomI = getRandomInt(0, numSquaresPerRow - 1);
	var randomJ = getRandomInt(0, numSquaresPerRow - 1);
	counter = 0;

	for (i = 0; i < numSquaresPerRow; i++) {

		for (j = 0; j < numSquaresPerRow; j++) {
			if (i == randomI && j == randomJ) {
				id = "secret";
			}
			else id = "normal";

			cells.push(templ_cell({id: id, shape: shapes[shapeIndex]}));
			if (alternateShapes) shapeIndex = 1 - shapeIndex;
		}

		rows.push(templ_row({cells}));
		cells = [];
	}

	var tBody = document.getElementById('squaresTbody');
	tBody.innerHTML = templ_table({rows});

	var table = document.getElementById('squaresTable');
	originalTableSize = table.clientHeight * 2;
	
	changeTableHeight();

	setup();
}

function setup() {
	squares = document.getElementsByClassName("square");
	secretSquare = document.getElementById("secret");
	playPause = document.getElementById("playPause");
	audio = document.getElementById("audio");
	header = document.getElementById("pageHeader");
	subtitle = document.getElementById("subtitle");
	dBody = document.body;
	playPauseSwitch = 0;

	playPause.addEventListener("click", playPauseClick, false);
	secretSquare.addEventListener("click", clickSecretSquare, true);
	dBody.addEventListener("mousemove", mouseMove, false);
	window.addEventListener("resize", changeTableHeight);

	for(i = 0; i < squares.length; i++) {
		squares[i].oncontextmenu = function (e) {
	    	e.preventDefault();
	    }
	}
}

function playPauseClick () {
	if (playPauseSwitch == 0) {
		audio.pause()
		playPause.src = "assets/play_icon.png";
		playPauseSwitch = 1;
	}
	else {
		audio.play();
		playPause.src = "assets/pause_icon.png";
		playPauseSwitch = 0;
	}
}

function clickSecretSquare() {
	alert("You did it! Congrats.");
	header.innerHTML = "Congratulations!";
	subtitle.innerHTML = "Click Refresh to play again or <a href='/index.html'> click here </a> to go back to the home page.";
	dBody.removeEventListener("mousemove", mouseMove);

	removeClickListener();
	runWinColors();
}

function mouseMove(evt) {
	audio.play();

	var dist = calculateDistance(secretSquare, evt);
	var volume = 0;
	var color = 200;
	if (dist < 300) {
		var volume = (300-dist)/300;
	}

	if (dist < 200) {
		color = 200 + Math.floor(55 * ((200-dist)/200));
	}

	var hexColor = color.toString(16);
	var colorString = hexColor + hexColor + hexColor;

	audio.volume = volume;
	dBody.style.background = "#" + colorString;
}

function calculateDistance(elem, e) {
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	var rect = elem.getBoundingClientRect();
	var width = rect.right - rect.left;
	var height = rect.bottom - rect.top;

    return Math.floor(Math.sqrt(
    	Math.pow(mouseX - (rect.left+(width/2)), 2) 
    	+ Math.pow(mouseY - (rect.top+(height/2)), 2)
    	));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeClickListener() {
	secretSquare.removeEventListener("click", clickSecretSquare);
}

function runWinColors() {
	var intervalID = window.setInterval(colorLoop, 100);
}

function colorLoop() {
	var timeout;
	var red = 0;
	var blue = 0;
	var green = 0;
	
	var frequency = .3;
	var colorSpeedLimiter = 0;
	
	if(counter > 32) {
		counter = 0;
	}
	
	else {
		red   = Math.sin(frequency*counter + 0) * 127 + 128;
		green = Math.sin(frequency*counter + 2) * 127 + 128;
		blue  = Math.sin(frequency*counter + 4) * 127 + 128;
		counter += 1;
	}

	var rgb = stringToRGB(red, blue, green);
	if (rgb != "rgb(0,0,0)") {
		for(i = 0; i < squares.length; i++) {
			squares[i].style.color = rgb;
		}
	}
}

function stringToRGB(r, g, b)
{
	return 'rgb(' + Math.round(r) + ',' + 
		Math.round(g) + ',' + 
		Math.round(b) + ')';
}

function changeTableHeight() {
	var table = document.getElementById('squaresTable');
	
	var tableWidth = table.clientHeight * 2;

	if (originalTableSize > (window.innerWidth * 0.8)) {

		if (tableWidth > (window.innerWidth * 0.8) ) {
			tableWidth = window.innerWidth * 0.8;
		}
	}
	else if (tableWidth > originalTableSize) {
		tableWidth = originalTableSize;
	}

	table.style.width = tableWidth;
	table.style.height = tableWidth;
}
