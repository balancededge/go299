"use strict"
/*
The game model
*/

class Game{
	constructor(id, size){
		this.Board = new Board(size);
		this.player1 = 1;
		this.player2 = 2;
		this.player1score = 0;
		this.player2score = 0;
		this.id = id;
		this.turn = this.player1;
	}

	move(x, y, pass){
		if (this.turn == this.player1){
			if (!pass){
				var captured = this.Board.move(new Move(x, y, this.player1));
				this.player1score += captured.length;
			}
			this.turn = this.player2;
		}
		else{
			if (!pass){
				var captured = this.Board.move(new Move(x, y, this.player2));
				this.player2score += captured.length;
			}
			this.turn = this.player1;
		}
		return captured;
	}

	copyState(){
		return {player1score: this.player1score, player2score: this.player2score, turn: this.turn, board: this.Board.gridCopy(this.Board.grid)};
	}

	resetState(gamestate){
		this.player1score = gamestate.player1score;
		this.player2score = gamestate.player2score;
		this.turn = gamestate.turn;
		this.Board.grid = this.Board.gridCopy(gamestate.board);
	}
}

class Board{
	constructor(size){
		this.size = size;
		this.grid = [];
		this.oldGrid1 = [];
		this.oldGrid2 = [];
		for (var i = 0; i < size; i++){
			this.grid.push([]);
			for (var j = 0; j < size; j++){
				this.grid[i].push(0);
			}
		}
		this.oldGrid1 = this.gridCopy(this.grid);
		this.oldGrid2 = this.gridCopy(this.grid);
	}

	move(Move){
		if (!this.isValidMove(Move))
			throw "InvalidMoveException";

		this.grid[Move.x][Move.y] = Move.side;

		var captured = isCapture(this, Move);
		if (captured.length == 0){
			if (isSuicide(this, Move)){
				this.grid[Move.x][Move.y] = 0;
				throw "SuicideException";
			}
		}
		for (var i = 0; i < captured.length; i++){
			this.grid[captured[i].x][captured[i].y] = 0;
		}

		if(this.gridCompare(this.grid,this.oldGrid2)){
			this.grid = this.oldGrid1;
			throw "ReturnToOldStateException";
		}

		this.oldGrid2 = this.oldGrid1;
		this.oldGrid1 = this.gridCopy(this.grid);
		return captured;
	}

	isValidMove(Move){
		if (this.grid[Move.x][Move.y] != 0)
			return false;
		return true;
	}

	gridCopy(grid){
		var newGrid =[];

		for (var i = 0; i < grid.length; i++){
			newGrid.push([]);
			for (var j = 0; j < grid.length; j++){
				newGrid[i].push(grid[i][j]);
			}
		}

		return newGrid;
	}

	gridCompare(grid1, grid2){

		//console.log(grid1,grid2);

		if(grid1 == [] || grid2 == [])
			return false;

		for(var i = 0; i < grid1.length; i++){
			for(var j = 0; j < grid1.length; j++){
				if(grid1[i][j] != grid2[i][j])
					return false;
			}
		}

		return true;
	}

	toString(){
		for (var i = 0; i < this.size; i++){
			console.log(this.grid[i]);
		}
	}
}

class Player{
	
}

class Move{
	constructor(x, y, side){
		this.x = x;
		this.y = y;
		this.side = side;
	}
}