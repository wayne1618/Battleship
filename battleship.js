var field;
var numGuess = 0;
var gameOver = false;

var boats = [new Array (5),new Array (4),new Array (3),new Array (3),new Array (2)];
var names = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];

//var boats = [new Array (7)];
//var names = ["Carrier"];

const SIZE = 10;

const value = ["","1","2","3","4","5","6","7","8", "9", "10"];

window.onload = function () {
	setGame();
}

function setGame () {
		
	field = new Array(SIZE);
	let tile;
	
	for (let i = 0; i < SIZE; i++)
		field[i] = new Array(SIZE).fill(' ');
	
	setBoats();
	
	// top row
	for (let i = 0 ; i < value.length; i++) {
		tile = document.createElement("div");
		tile.classList.add ("frame", "tile");
		tile.innerText = value[i];
		document.getElementById("field").append(tile);
	}
	
	//rest field
	for (let r = 0 ; r < SIZE; r++) {
		tile = document.createElement("div");
		tile.classList.add ("frame", "tile");
		tile.innerText = value[r + 1];
		document.getElementById("field").append(tile);
		for (let c = 0 ; c < SIZE; c++) {
			//<div id="0-0"></div>
			tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
			tile.classList.add("tile", "unchecked");
			//tile.innerText = field[r][c];
			tile.addEventListener("click", checkTile);
			document.getElementById("field").append(tile);
		}
	}
}

function setBoats() {
	for (let index = 0 ;index < boats.length; index++) {
		let b = boats[index];
		let isGood = false;
		let horz = true;
		let xPos = -1;
		let yPos = -1;
		while (!isGood) {
			horz = getRand(2) == 0;
			xPos = getRand(SIZE - 5);
			yPos = getRand(SIZE);
			for (let i = 0; i <= b.length; i++){
				if (i == b.length) {isGood = true; continue;} //completed for loop
				if (horz) {
					if (xPos + i >= SIZE) break; //reached out of bounds
					if (field[yPos][xPos + i] == 'X') break; //found boat already in position
				}
				else {
					if (yPos + i >= SIZE) break; //reached out of bounds
					if (field[yPos + i][xPos] == 'X') break; //found boat already in position
				}
			}
		}
		//set targets and log boats
		if (horz) {
			for (let i = 0; i < b.length; i++){
				field[yPos][xPos + i] = 'X';
				b[i] = yPos + "-" + (xPos + i);
			}
		}
		else {
			for (let i = 0; i < b.length; i++){
				field[yPos + i][xPos] = 'X';
				b[i] = (yPos + i) + "-" + xPos;
			}
		}
	}
}

function updateBoat (coord) {
	for (let i = 0; i < boats.length; i++)
		for (let j = 0; j < boats[i].length; j++){
			//let b = boats[i];
			if (boats[i][j] == coord) {
				//console.log(boats[i]);
				boats[i].splice(j, 1);
				if(boats[i].length == 0){
					window.alert("You sunk my " + names[i] + " in " + numGuess + " shots!");
					names.splice(i,1);
					boats.splice(i,1);
					if (boats.length == 0) {
						if (confirm ("You sunk all my ships!\nTook you " + numGuess + " shots!")) {
							resetGame();
						}
						else
							gameOver = true;
					}
				}
				return;
			}
		}
}

function resetGame() {
	numGuess = 0;
	gameOver = false;
	boats = [new Array (5),new Array (4),new Array (3),new Array (3),new Array (2)];
	names = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
	
	//cycle through all tiles changing tile to unchecked
	for (let r = 0; r < SIZE; r++)
		for (let c = 0; c < SIZE; c++) {
			let t = document.getElementById(r + "-" + c);
			//console.log(t);
			t.classList = [];
			t.classList.add("tile", "unchecked");
			t.innerText = "";
		}
	
	for (let i = 0; i < SIZE; i++)
		field[i] = new Array(SIZE).fill(' ');
	
	setBoats();
}


function getRand (r) {
	return Math.floor(Math.random() * r);
}

function checkTile () {
	
	if (gameOver) {
		return;
	}
	
	let coords = this.id.split("-");
	let r = parseInt (coords[0]);
	let c = parseInt (coords[1]);
	
	if (this.classList.contains("checked"))
		return;
	
	numGuess++;
	
	this.classList.add("checked");
	this.innerText = "o";
	this.classList.add((field[r][c] == "X") ? "hit" : "miss");
	if (field[r][c] == "X") updateBoat(r + "-" + c);
	
}