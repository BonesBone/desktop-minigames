
/*
    main game functions
*/
isSinglePlayer = false;
isPlayersTurn = true;
gameIsRunning = true;

playerScores = [0,0,0];

//represent the board of the game
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
const tileButtons = document.querySelectorAll(".Tile-Button");

//current selected row and collumn of the board
boardRow = 0;
boardCollumn = 0;

//statistics variables
gameResultData = [0,0,0] //1st value = player 1 wins, 2nd value = player 2 wins, 3rd value = games tied

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

    let botRowTiles = 0;
    let playerRowTiles = 0;

    let botCollumTiles = [0,0,0];
    let playerCollumTiles = [0,0,0];

    let botDiagonalTiles = {'leftDiagonal': 0, 'rightDiagonal': 0};
    let playerDiagonalTiles = {'leftDiagonal': 0, 'rightDiagonal': 0};

    let emptyRowTile = [];
    let emptyDiagonalTiles = [[], []];

    let emptyTiles = [];
    let emptyCollumnTiles = [[],[],[]];
    for(let i = 1; i < 10; i++){
        let boardRow = getRow(i);
        let boardCollumn = getCollumn(i);

        switch(gameBoard[boardRow][boardCollumn]){
            case botSign:
                botRowTiles++;
                botCollumTiles[boardCollumn]++;

                if(boardRow == boardCollumn){
                    botDiagonalTiles['leftDiagonal']++;
                }
                if(boardRow == 2 - boardCollumn){
                    botDiagonalTiles['rightDiagonal']++;
                }
                break;

            case playerSign:
                playerRowTiles++;
                playerCollumTiles[boardCollumn]++;

                if(boardRow == boardCollumn){
                    playerDiagonalTiles['leftDiagonal']++;
                }
                if(boardRow == 2 - boardCollumn){
                    playerDiagonalTiles['rightDiagonal']++;
                }
                break;

            case '':
                emptyRowTile = [boardRow, boardCollumn, getButtonId(i)];
                emptyCollumnTiles[boardCollumn] = [boardRow, boardCollumn, getButtonId(i)];
                emptyTiles.push(emptyRowTile);

                if(boardRow == boardCollumn){
                    emptyDiagonalTiles[0] = [boardRow, boardCollumn, getButtonId(i)];                
                }
                if(boardRow == 2 - boardCollumn){
                    emptyDiagonalTiles[1] = [boardRow, boardCollumn, getButtonId(i)];
                }
                
                break;
        }


        /*
            at the end of each diagonal row of the board, check for winning moves and moves to block the player
        */
        if(i == 7){ //check right to left diagonal ↓
            if((botDiagonalTiles['rightDiagonal'] == 2 || playerDiagonalTiles['rightDiagonal'] == 2) && botDiagonalTiles['rightDiagonal'] + playerDiagonalTiles['rightDiagonal'] < 3){
                makeMove(2, emptyDiagonalTiles[1][2], emptyDiagonalTiles[1][0], emptyDiagonalTiles[1][1]);
                return;
            }
           
        } else if(i == 9){ //check left to right diagonal ↓
             if((botDiagonalTiles['leftDiagonal'] == 2 || playerDiagonalTiles['leftDiagonal'] == 2) && botDiagonalTiles['leftDiagonal'] + playerDiagonalTiles['leftDiagonal'] < 3){
                makeMove(2, emptyDiagonalTiles[0][2], emptyDiagonalTiles[0][0], emptyDiagonalTiles[0][1]);
                return;
            }
            
        }

        /*
            at the end of each row or collumn, check for winning moves and moves to block the player
            winning moves are prioritized first, then blocking moves
        */
        if(i > 6){ //check collumns for winning moves ↓
            if(botCollumTiles[boardCollumn] == 2 && playerCollumTiles[boardCollumn] == 0){
                makeMove(2, emptyCollumnTiles[boardCollumn][2], emptyCollumnTiles[boardCollumn][0], emptyCollumnTiles[boardCollumn][1]);
                return;
            }
        }
        if(i % 3 == 0){ //check rows for winning moves ↓
            if(botRowTiles == 2 && playerRowTiles == 0){
                makeMove(2, emptyRowTile[2], emptyRowTile[0], emptyRowTile[1]);
                return;
            }
        }
        
        if(i > 6){ //check collumns for blocking moves ↓
            if(playerCollumTiles[boardCollumn] == 2 && botCollumTiles[boardCollumn] == 0){
                makeMove(2, emptyCollumnTiles[boardCollumn][2], emptyCollumnTiles[boardCollumn][0], emptyCollumnTiles[boardCollumn][1]);
                return;
            }            
        }
        if(i % 3 == 0){ //check rows for blocking moves ↓
            if(playerRowTiles == 2 && botRowTiles == 0){
                makeMove(2, emptyRowTile[2], emptyRowTile[0], emptyRowTile[1]);
                return;
            }

            botRowTiles = 0;
            playerRowTiles = 0;
        }
    }
    let emptyTile = emptyTiles[Math.floor(Math.random()*emptyTiles.length)];
    makeMove(2, emptyTile[2], emptyTile[0], emptyTile[1]);
}



/*
  function for creating a new game
*/
const newGameButton = document.getElementById("restart-button");

newGameButton.addEventListener("click", function(){
    //resets the board and sets the gamemode
    let gameMode = document.getElementById("game-mode-select").value;
    if(gameMode == "one-player"){
        if(!isSinglePlayer){
            resetScores();
            isSinglePlayer = true;
        }

    } else if(gameMode == "two-player"){
        if(isSinglePlayer){
            resetScores();
            isSinglePlayer = false;
        }

    } else {
        return;
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

    hideWin()
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
        gameResultData[player-1]++
        showWin("Player " + player + " wins")

        playerScores[player-1]++;
        document.getElementById("player-" + player + "-score").textContent = playerScores[player-1];        
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
        gameResultData[2]++
        showWin("Tie")

        playerScores[2]++;
        document.getElementById("tie-score").textContent = playerScores[2];
    }
}

/*
    resets the scores
*/
function resetScores(){
    playerScores = [0,0,0];
    document.getElementById("player-1-score").textContent = 0;
    document.getElementById("player-2-score").textContent = 0;
    document.getElementById("tie-score").textContent = 0;
}

/*
    Show the win/lose screen, save win and tie data
*/
winSplash = document.getElementById("win-splash")
function showWin(winText){
    document.getElementById("win-splash-text").innerText = winText
    winSplash.style.visibility = 'visible';

    saveData()
}

function hideWin(){
    winSplash.style.visibility = 'hidden';
}

winSplash.addEventListener("click", hideWin)


/*
    utility functions

    gets the row of the board using the button element passed
*/
function getRow(id){
    if(typeof id == 'string'){
        let buttonNumber = parseInt(id.charAt(id.length - 1));
        return Math.floor((buttonNumber - 0.1) / 3);
    } else {
        return Math.floor((id - 0.1) / 3)
    }
    
}

//get the collumn of the board using the button element passed
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

    button.style.backgroundImage = "url(\"./TicTacToe/" + playerSign + ".png\")";
    button.value = playerSign;
    gameBoard[row][collumn] = playerSign;
}


function getButtonId(btnNumber){
    return document.getElementById("tile-" + btnNumber + "-button");
}


//const { ipcMain, ipcRenderer } = require('electron');
/*
    Saving data:
        for simple statistics data, electron-store is used to save data
*/

//const Store = require('electron-store')
//const storage = new Store()

function saveData(){
    window.electronAPI.saveTTTData(gameResultData)
    gameResultData = [0,0,0]
}

