//
// simple Tic-Tac-Toe game
// JS desktop version
// ver. 0.3: pictures only, no colors
// Gregory Skomorovsky, readln.me
//

const gridColor      = "#888888";

let mainCanvasWidth  = 500;
let mainCanvasHeight = 800;

const gameField_x      = 0;
const gameField_y      = 0;
const gameFieldWidth   = 500;
const gameFieldHeight  = 500;
const userColor        = "#FF9900";
const computerColor    = "#9900CC";

const canvasBackgroundColor="#FFFFFF";

const emptyColor    = "#FFFFFF";
const winnerColor   = "red";
const strokeColor   = "#BBBBBB";

var viewMode = "Classic"; // "Cats", "Colors"

class User {
	constructor (name, color) {
		this.name = name;
		this.color = color;
	}
	
	doGame() { return (1, 0); }

} // class User

class PCUser extends User {
  	constructor(name, color) {
    	super(name, color);
  }

} // class PCUser


let user1 = new User ("User", userColor);
let user2 = new PCUser ("Cat Methodius", computerColor);

class Cell {
	constructor (color, x, y) {
		this.color = color;
		this.x = x;
		this.y = y;
	}
}

class GameField {
  
  	cells = new Array();
  	winsCellsIndex = new Array();

  	constructor(dimension, maxWidth, backgroundColor) {
    
	    this.dimension = dimension;
	    this.width = (Math.trunc(maxWidth/dimension)) * dimension;
	    this.backgroundColor = backgroundColor;

	    // create cells' array

	    for (let i=0; i < this.dimension; i++) {
	    	for (let k=0; k < this.dimension; k++) {
				let newcell = new Cell(backgroundColor, k, i);
	    		this.cells.push(newcell);
	    	}
	    	this.winsCellsIndex.push(0);
	    }

 	 } // constructor

  getCellIndexFromCoord (x, y) {
    	
    	let i = ( Math.trunc( x / (this.width / this.dimension) ) ) + 0;
    	let k = ( Math.trunc( y / (this.width / this.dimension) ) ) + 0;

    	for (let a = 0; a < this.cells.length; a++) {
    		if (this.cells[a].x == k && this.cells[a].y == i) return a; // returns an index in the array "cells"
    	}

    	return -1;

  } // getCellIndexFromCoord 


setWinnersCells() {


	for (let i=0; i<this.dimension; i++) {
			  			this.cells[(this.winsCellsIndex[i])].color = winnerColor;
			  		}


} // setWinnersCells


displayField() {

  	// visualization game field

	context.beginPath();

	context.lineWidth = 1;
	context.strokeStyle = gridColor;

	let cellIndex=0;
	for (let i=0; i<field.dimension; i++)
		for (let k=0; k<field.dimension; k++) {
			
			let cellWidth = field.width/field.dimension;

			//context.fillStyle = field.cells[cellIndex].color;
			context.fillStyle = "white";
			context.fillRect(i*cellWidth, k*cellWidth, cellWidth, cellWidth);
			context.strokeRect(i*cellWidth, k*cellWidth, cellWidth, cellWidth);

			if (field.cells[cellIndex].color == user1.color) {
				
				let img = new Image();
			
				if (viewMode == "Classic") img.src = 'img/cross.png';
				if (viewMode == "Cats")    img.src = 'img/pya.png';

				img.onload = function() {
    					context.drawImage (img, i*cellWidth, k*cellWidth, cellWidth, cellWidth);
    					context.strokeRect(i*cellWidth, k*cellWidth, cellWidth, cellWidth);
	 			};

			}

			if (field.cells[cellIndex].color == user2.color) {
				
				let img = new Image();

				if (viewMode == "Classic") img.src = 'img/zero.png';
				if (viewMode == "Cats")    img.src = 'img/ko.png';
			
				img.onload = function() {
						context.drawImage (img, i*cellWidth, k*cellWidth, cellWidth, cellWidth);
    					context.strokeRect(i*cellWidth, k*cellWidth, cellWidth, cellWidth);
    			};

			}


			if (field.cells[cellIndex].color == winnerColor) {

				let img = new Image();
				img.src = 'img/w.png';
				img.onload = function() {
						context.globalAlpha = 0.8;
						//context.fillStyle = "red";
    					context.drawImage (img, i*cellWidth, k*cellWidth, cellWidth, cellWidth);
    					context.strokeRect(i*cellWidth, k*cellWidth, cellWidth, cellWidth);
    					context.globalAlpha = 1;
	 			};

			}

			cellIndex++;
			
		}

	context.closePath();

	context.globalAlpha = 1;

  } // displayField()


checkWinner (clr) {

	// horizontal vectors
	
	for (let i=0; i < this.dimension; i++) {
		let counter = 0;
		for (let k=0; k < this.dimension * this.dimension; k+=this.dimension) {
			if (this.cells[i+k].color == clr) {
				this.winsCellsIndex[counter++] = i+k;
			} 

		}
		if (counter == this.dimension) { return true; } 
	}

	// vertical vectors
	
	for (let i=0; i < this.dimension * this.dimension; i+=this.dimension) {
		let counter = 0;
		for (let k=0; k < this.dimension; k++) {
			if (this.cells[i+k].color == clr) {
				this.winsCellsIndex[counter++] = i+k;
			} 
		}
		if (counter == this.dimension) { return true; }
	}


	// main diag

	{
		let counter = 0;
		for (let i=0; i < (this.dimension * this.dimension); i+=(this.dimension+1)) {
			if (this.cells[i].color == clr) {
				this.winsCellsIndex[counter++] = i;
			} 
		}
		if (counter == this.dimension)  { return true; }
	}

	// anti diag

	{
		let counter = 0;
		
		for (let i = this.dimension-1; i < (this.dimension * this.dimension)-1; i+=(this.dimension-1)) {
			
			if (this.cells[i].color == clr) {
				
				this.winsCellsIndex[counter++] = i;
			}
		}
		if (counter == this.dimension) { return true; }
	}


	return false;


} //checkWinner
	

} // class GameField 


// PC makes a game

function doPCgame () {

  	freeCellsIndex = new Array();

  	// horizontal vectors

	for (let i=0; i < field.dimension; i++) {
		
		let userTotal = 0;
		let compTotal = 0;
		let freeIndex = -1;
		let k=0;
		

		for (; k < field.dimension * field.dimension; k+=field.dimension) {
			
			if (field.cells[i+k].color == user1.color) userTotal++;  
			if (field.cells[i+k].color == user2.color) compTotal++;
			
			if (field.cells[i+k].color == emptyColor) {
				
				freeIndex = i+k;
				freeCellsIndex.push(freeIndex); 

			}
		}

		// there is just 1 free cell to computer's victory in the current vector  
		if ((compTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		
		// there is just 1 free cell to user's victory in the current vector
		if ((invariant) && (userTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		
	}

	// vertical vectors
	
	for (let i=0; i < field.dimension * field.dimension; i+=field.dimension) {
		
		let userTotal = 0;
		let compTotal = 0;
		let freeIndex = -1;
		let k=0;

		for (; k < field.dimension; k++) {
			if (field.cells[i+k].color == user1.color) userTotal++;  
			if (field.cells[i+k].color == user2.color) compTotal++;
			if (field.cells[i+k].color == emptyColor) {
				
				freeIndex = i+k;
				freeCellsIndex.push(freeIndex);

			}
		}

		// there is just 1 free cell to computer's victory in the current vector  
		if ((compTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		
		// there is just 1 free cell to user's victory in the current vector
		if ((invariant) && (userTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		

	}

	// main diag

	{

		let userTotal = 0;
		let compTotal = 0;
		let freeIndex = -1;
		let i=0;

		for (let i=0; i < (field.dimension * field.dimension); i+=(field.dimension+1)) {
			if (field.cells[i].color == user1.color) userTotal++;
			if (field.cells[i].color == user2.color) compTotal++;
			if (field.cells[i].color == emptyColor) {
				
				freeIndex = i;
				freeCellsIndex.push(freeIndex);

			}
		}
		
		// there is just 1 free cell to computer's victory in the current vector  
		if ((compTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		
		// there is just 1 free cell to user's victory in the current vector
		if ((invariant) && (userTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
	
	} // main diag


	// anti diag

	{
		
		let userTotal = 0;
		let compTotal = 0;
		let freeIndex = -1;
		let i=0;
		
		for (let i = field.dimension-1; i < (field.dimension * field.dimension)-1; i+=(field.dimension-1)) {
			if (field.cells[i].color == user1.color) userTotal++;
			if (field.cells[i].color == user2.color) compTotal++; 
			if (field.cells[i].color == emptyColor) {
				
				freeIndex = i;
				freeCellsIndex.push(freeIndex);

			}
		}
	
		// there is just 1 free cell to computer's victory in the current vector  
		if ((compTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}
		
		// there is just 1 free cell to user's victory in the current vector
		if ((invariant) && (userTotal == field.dimension - 1) && (freeIndex >= 0)) {
			field.cells[freeIndex].color = user2.color;
			return 1;
		}

	} // anti diag


	if (freeCellsIndex.length > 0) {

		let _q = 0;
		if (field.dimension > 0   && field.dimension < 10) _q = 100;
		if (field.dimension >= 10 && field.dimension < 100) _q = 1000;

		let random=0;
		do {

			random = Math.floor (Math.random() * _q);
			if (random < freeCellsIndex.length) break;

		} while(true);
		
		field.cells[(freeCellsIndex[random])].color = user2.color;

		return 1;

	}

	if (freeCellsIndex.length == 0) {

		return 0; // there are no free cells

	}


return 0;

} //function doPCgame 


function goTrueFalse() {

	let random = Math.floor (Math.random() * 100);

	return (0 <= random && random < 50) ? true : false;

} // function goTrueFalse



//=====================================================================================

let invariant = true; // ai imitation

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = mainCanvasWidth;
canvas.height = mainCanvasHeight;

context.fillStyle = canvasBackgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

let field = new GameField (3, mainCanvasWidth, emptyColor);

field.displayField();


function message (text) {
	
	const imgX = 65;
	const imgY = 510;
	const imgW = 393;
	const imgH = 70;

	let img_msg = new Image();
	context.globalAlpha = 0.5;

	if (text == "Clear") {
  			
  		img_msg.src = 'img/empty.png';
		img_msg.onload = function() {
			context.drawImage (img_msg, imgX, imgY, imgW, imgH);
		};

	}
	
	if (text == "You won!") {

  		img_msg.src = 'img/won.png';
		img_msg.onload = function() {
			context.drawImage (img_msg, imgX, imgY, imgW, imgH);
		};

	}

	if (text == "Computer won!") {
  
  		img_msg.src = 'img/compwon.png';
		img_msg.onload = function() {
			context.drawImage (img_msg, imgX, imgY, imgW, imgH);
		};

	}
	
	if (text == "It's draw!") {

		img_msg.src = 'img/draw.png';
		img_msg.onload = function() {
			context.drawImage (img_msg, imgX, imgY, imgW, imgH);
		};

	}

	context.globalAlpha = 1;
  
} // function message

message("Clear");

const dimButtonWidth   = 110;
const dimButtonHeight  = 35;
const modeButtonWidth  = 228;
const modeButtonHeight = 70;

// button 3x3

	const button33_x = 1;
	const button33_y = 600;
	let img33 = new Image();
	img33.src = 'img/33.png';
	img33.onload = function() {
		context.drawImage (img33, button33_x, button33_y, dimButtonWidth, dimButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(button33_x, button33_y, dimButtonWidth, dimButtonHeight);
	};

// button 5x5

	const button55_x = 130;
	const button55_y = 600;
	let img55 = new Image();
	img55.src = 'img/55.png';
	img55.onload = function() {
		context.drawImage (img55, button55_x, button55_y, dimButtonWidth, dimButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(button55_x, button55_y, dimButtonWidth, dimButtonHeight);
	};


// button 7x7

	const button77_x = 260;
	const button77_y = 600;
	let img77 = new Image();
	img77.src = 'img/77.png';
	img77.onload = function() {
		context.drawImage (img77, button77_x, button77_y, dimButtonWidth, dimButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(button77_x, button77_y, dimButtonWidth, dimButtonHeight);
	};


// button 10x10

	const button10_x = 389;
	const button10_y = 600;
	img1010 = new Image();
	img1010.src = 'img/1010.png';
	img1010.onload = function() {
		context.drawImage (img1010, button10_x, button10_y, dimButtonWidth, dimButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(button10_x, button10_y, dimButtonWidth, dimButtonHeight);
	};

// button classic

	const buttonClassic_x = 1;
	const buttonClassic_y = 680;
	imgClassic = new Image();
	imgClassic.src = 'img/classic.png';
	imgClassic.onload = function() {
		context.drawImage (imgClassic, buttonClassic_x, buttonClassic_y, modeButtonWidth, modeButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(buttonClassic_x, buttonClassic_y, modeButtonWidth, modeButtonHeight);
	};

// button cats

	const buttonCats_x = 270;
	const buttonCats_y = 680;
	imgCats = new Image();
	imgCats.src = 'img/cats.png';
	imgCats.onload = function() {
		context.drawImage (imgCats, buttonCats_x, buttonCats_y, modeButtonWidth, modeButtonHeight);
		context.strokeStyle = strokeColor;
		context.strokeRect(buttonCats_x, buttonCats_y, modeButtonWidth, modeButtonHeight);
	};


context.globalAlpha = 1;

// --------------------------------------------------------------------------------------

let gameOver = false;

canvas.addEventListener('click', clickEvent, {
	once: true
});

function clickEvent() {
		let x=event.offsetX;
	  	let y=event.offsetY;
	  	
	  	gameDriver (x, y);
}

function gameDriver (x, y) {

	// Is it a game field ?
	if ( (!gameOver) && (x > gameField_x && x < gameField_x+gameFieldWidth) && (y > gameField_y && y < gameField_y+gameFieldHeight)) {
				
			// DO GAME! 
			
			let icell = field.getCellIndexFromCoord(x, y);

		  	if (field.cells[icell].color == emptyColor) { 
				
				field.cells[icell].color = user1.color; 

				field.displayField();

			  	if (field.checkWinner(user1.color)) {
			  		// user1.color WIN!!!
			  		gameOver = true;
			  		field.setWinnersCells();
			  		field.displayField();
			  		message("You won!");
			  	} else {
			  		if (doPCgame() == 0) {
			  			// It's a draw!
			  			gameOver = true;
			  			field.displayField();
			  			message("It's draw!");
			  		} else {

						field.displayField();
				  		if (field.checkWinner(user2.color)) {
							// user2.color WIN!!!	
							gameOver = true;
						  	field.setWinnersCells();
						  	field.displayField();
						  	message("Computer won!");
						}

			  		}
			  	
			  	}
		  	}
		} // if - Is it a game field


	// button 3x3
	if ((x > button33_x && x < button33_x+dimButtonWidth) && (y > button33_y && y < button33_y+dimButtonHeight)) {
			// to clear and start again
			gameOver = false;
			field = new GameField (3, mainCanvasWidth, emptyColor);
			message("Clear");
			field.displayField();
		}

	// button 5x5
	if ((x > button55_x && x < button55_x+dimButtonWidth) && (y > button55_y && y < button55_y+dimButtonHeight)) {
			// to clear and start again
			gameOver = false;
			field = new GameField (5, mainCanvasWidth, emptyColor);
			message("Clear");
			field.displayField();
		}

	// button 7x7
	if ((x > button77_x && x < button77_x+dimButtonWidth) && (y > button77_y && y < button77_y+dimButtonHeight)) {
			// to clear and start again
			gameOver = false;
			field = new GameField (7, mainCanvasWidth, emptyColor);
			message("Clear");
			field.displayField();
		}

	// button 10x10
	if ((x > button10_x && x < button10_x+dimButtonWidth) && (y > button10_y && y < button10_y+dimButtonHeight)) {
			// to clear and start again
			gameOver = false;
			field = new GameField (10, mainCanvasWidth, emptyColor);
			message("Clear");
			field.displayField();
		}

	// button Classic
	if ((!gameOver) && (x > buttonClassic_x && x < buttonClassic_x+modeButtonWidth) && (y > buttonClassic_y && y < buttonClassic_y+modeButtonHeight)) {
			viewMode = "Classic";
			field.displayField();
		}

	// button Cats
	if ((!gameOver) && (x > buttonCats_x && x < buttonCats_x+modeButtonWidth) && (y > buttonCats_y && y < buttonCats_y+modeButtonHeight)) {
			viewMode = "Cats";
			field.displayField();
		}


	// ai imit

	invariant = goTrueFalse();

	console.log("invariant=", invariant);

	// return to listening

	canvas.addEventListener('click', clickEvent, {
	once: true
	});

}

