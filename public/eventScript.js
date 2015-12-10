var audio = document.getElementById("audio");
var playPause = document.getElementById("playPause");
var header = document.getElementById("theHeader");
var subtitle = document.getElementById("subtitle");
var dBody = document.body;
var numSquaresPerRow = 50;
var playPauseSwitch = 0;
var counter = 0;
var squares;
var secretSquare;
var secretSquareWrapper;


buildTable();

squares = document.getElementsByClassName("square");
secretSquare = document.getElementById("secret");
secretSquareWrapper = document.getElementById("secretWrapper");

playPause.addEventListener("click", playPauseClick, false);
secretSquare.addEventListener("click", clickSecretSquare, true);
secretSquareWrapper.addEventListener("click", clickSecretSquareWrapper, false);
dBody.addEventListener("mousemove", mouseMove, false);
dBody.addEventListener("click", clickBody, false);

for(i = 0; i < squares.length; i++) {
	squares[i].oncontextmenu = function (e) {
    	e.preventDefault();
    }
}
  

function clickBody() {
	dBody.style.cursor = "not-allowed";
	window.setTimeout(changeCursorBack, 500);
}

function changeCursorBack() {
	dBody.style.cursor = "default";
}

function clickSecretSquareWrapper(e) {
	e.stopPropagation();
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
	secretSquare.style.color = "red";
	header.innerHTML = "Congratulations!";
	subtitle.innerHTML = "Click Refresh to play again.";
	dBody.removeEventListener("mousemove", mouseMove);

	removeClickListener();
	runWinColors();
}

function mouseMove(evt) {
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

function buildTable() {
	var addedRows = "";
	var randomI = getRandomInt(0, numSquaresPerRow - 1);
	var randomJ = getRandomInt(0, numSquaresPerRow - 1);

	for (i = 0; i < numSquaresPerRow; i++) {
	var tableRow = "<tr>";

		for (j = 0; j < numSquaresPerRow; j++) {
			if (i == randomI && j == randomJ) {
				tableRow += "<td id='secretWrapper'><div class='square' id='secret'> &#x25A0; </div></td>";
			}
			else {
				tableRow += "<td><div class='square'> &#x25A0; </div></td>";
			}
		}

	tableRow += "</tr>";
	addedRows += tableRow;
	}

	var el = document.getElementById('squaresTbody');
	el.innerHTML = addedRows;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeClickListener() {
	secretSquare.removeEventListener("click", clickSecretSquare);
	dBody.removeEventListener("click", clickBody);
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
