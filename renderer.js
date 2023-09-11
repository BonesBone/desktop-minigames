
/*
    main game functions
*/
isSinglePlayer = false;
isPlayersTurn = true;
gameIsRunning = true;

//represent the board of the game
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
const tileButtons = document.querySelectorAll(".Tile-Button");

boardRow = 0;
boardCollumn = 0;

tileButtons.forEach(button => {
    button.addEventListener("click", function(){
        //setting the xy values for gameBoard
        let buttonId = button.parentNode.id;
        
        boardRow = getRow(buttonId);
        boardCollumn = getCollumn(buttonId);

        //takes the player's turn, passes it to the next
        if(gameIsRunning){
            if(isPlayersTurn && button.value == ''){
            //do player 1 stuff
                makeMove(1, button, boardRow, boardCollumn);

                isPlayersTurn = false;

                winResult('x', 1);

                if(isSinglePlayer && gameIsRunning){
                    calculateMove('o', 'x');
                    isPlayersTurn = true;
                    winResult('o', 2);
                }

                
                
            } else if(button.value == ''){
                if(!isSinglePlayer){
                    //do player 2 stuff
                    makeMove(2, button, boardRow, boardCollumn);

                    isPlayersTurn = true;

                }

                winResult('o', 2)
            }
        }
        
    });
});


/*
    function for the bot to calculate the move to play
*/
function calculateMove(botSign, playerSign){

    let numBotTiles = 0;
    let numPlayerTiles = 0;

    let numBotCollumTiles = [0,0,0];
    let numPlayerCollumTiles = [0,0,0];

    let emptyRowTile = [0,0, document.getElementById("tile-1-button")];
    let emptyCollumnTile = [0,0, document.getElementById("tile-1-button")];

    let emptyTiles = [];
    console.log("------");
    for(let i = 1; i < 10; i++){
        let boardRow = getRow(i);
        let boardCollumn = getCollumn(i);

        switch(gameBoard[boardRow][boardCollumn]){
            case botSign:
                numBotTiles++;
                numBotCollumTiles[boardCollumn]++;
                break;

            case playerSign:
                numPlayerTiles++;
                numPlayerCollumTiles[boardCollumn]++;
                break;

            case '':
                emptyRowTile = [boardRow, boardCollumn, document.getElementById("tile-" + i + "-button")];
                emptyCollumnTile = [boardRow, boardCollumn, document.getElementById("tile-" + i + "-button")];
                emptyTiles.push(emptyRowTile);
                break;
        }


        if(i % 3 == 0){
            if((numBotTiles == 2 || numPlayerTiles == 2) && numBotTiles + numPlayerTiles != 3){
                makeMove(2, emptyRowTile[2], emptyRowTile[0], emptyRowTile[1]);
                return;

            }

            numBotTiles = 0;
            numPlayerTiles = 0;
            numBotCollumTiles = [0,0,0];
            numPlayerCollumTiles = [0,0,0];
        }
    }
    /*console.log("[" + visuallizedBotBoard[0] + ", " + visuallizedBotBoard[1] + ", " + visuallizedBotBoard[2] + "]");
    console.log("[" + visuallizedBotBoard[3] + ", " + visuallizedBotBoard[4] + ", " + visuallizedBotBoard[5] + "]");
    console.log("[" + visuallizedBotBoard[6] + ", " + visuallizedBotBoard[7] + ", " + visuallizedBotBoard[8] + "]");
    console.log("---------");*/
    emptyTile = emptyTiles[Math.floor(Math.random()*emptyTiles.length)];
    makeMove(2, emptyTile[2], emptyTile[0], emptyTile[1]);

    /*
        check for diagonal
    */
    /*
    let numDiagonalTiles = {'leftDiagonal': 0, 'rightDiagonal': 0};
    for(let i = 0; i < 3; i++){
        if(gameBoard[i][i] == playerType){
            numDiagonalTiles['leftDiagonal'] += 1;
        }
        if(gameBoard[i][gameBoard.length-(i+1)] == playerType){
            numDiagonalTiles['rightDiagonal'] += 1;
        }
    }*/
}

/*
  function for creating a new game
*/
const newGameButton = document.getElementById("restart-button");

newGameButton.addEventListener("click", function(){
    //resets the board and sets the gamemode
    let gameMode = document.getElementById("game-mode-select").value;
    if(gameMode == "one-player"){
        isSinglePlayer = true;

    } else if(gameMode == "two-player"){
        isSinglePlayer = false;

    } else{
        alert("error");
    }

    resetBoard();
    isPlayersTurn = true;
    gameIsRunning = true;
});


function resetBoard(){
    tileButtons.forEach(button => {
        let buttonId = button.parentNode.id;
        
        boardRow = getRow(buttonId);
        boardCollumn = getCollumn(buttonId);

        button.style.backgroundImage = "";
        button.value = '';
        gameBoard[boardRow][boardCollumn] = '';
    });

}


/*
    function for checking if a player has won
*/
function checkForWin(playerType){
    /*
        check for collumn and row wins
    */
    let numTiles = 0;
    let numCollumTiles = [0,0,0];
    for(let i = 1; i < 10; i++){
        let boardRow = getRow(i);
        let boardCollumn = getCollumn(i);

        if(gameBoard[boardRow][boardCollumn] == playerType){
            numTiles++;
            numCollumTiles[boardCollumn]++;
        }

        if(numTiles == 3 || numCollumTiles[boardCollumn] == 3){
            gameIsRunning = false;  
            return true;
        }

        if(i % 3 == 0){
            numTiles = 0;
        }
    }

    /*
        check for diagonal win
    */
    let numDiagonalTiles = {'leftDiagonal': 0, 'rightDiagonal': 0};
    for(let i = 0; i < 3; i++){
        if(gameBoard[i][i] == playerType){
            numDiagonalTiles['leftDiagonal'] += 1;
        }
        if(gameBoard[i][gameBoard.length-(i+1)] == playerType){
            numDiagonalTiles['rightDiagonal'] += 1;
        }
    }

    if(numDiagonalTiles['leftDiagonal'] == 3 || numDiagonalTiles['rightDiagonal'] == 3){
        gameIsRunning = false;
        return true;
    }

    return false;
}


function winResult(playerSign, player){
    if(checkForWin(playerSign)){
        alert("player " + player + " win");
    } else {
        checkForTie();
    }
}

/*
    function for checking if the game board is full
*/
function checkForTie(){
    let hasEmptyTiles = false;
    for(let i = 1; i < 10; i++){
        let row = getRow(i);
        let collumn = getCollumn(i);

        if(gameBoard[row][collumn] == ''){
            hasEmptyTiles = true;
        }
    }

    if(!hasEmptyTiles){
        gameIsRunning = false;
        alert("Tie");
    }
}

/*
    utility functions
*/
function getRow(id){
    if(typeof id == 'string'){
        let buttonNumber = parseInt(id.charAt(id.length - 1));
        return Math.floor((buttonNumber - 0.1) / 3);
    } else {
        return Math.floor((id - 0.1) / 3)
    }
    
}


function getCollumn(id){
    if(typeof id == 'string'){
        let buttonNumber = parseInt(id.charAt(id.length - 1));
        return (buttonNumber + 2) % 3;
    } else {
        return (id + 2) % 3;
        
    }
    
}


function makeMove(player, button, row, collumn){
    let playerSign = 'x';
    if(player == 2){
        playerSign = 'o';
    }

    button.style.backgroundImage = "url(\"" + playerSign + ".png\")";
    button.value = playerSign;
    gameBoard[row][collumn] = playerSign;
}