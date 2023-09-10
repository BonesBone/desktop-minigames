
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
                button.style.backgroundImage = "url(\"X.png\")";
                button.value = 'x';
                gameBoard[boardRow][boardCollumn] = 'x';

                isPlayersTurn = false;
                if(checkForWin('x')){
                    alert("player 1 win");
                }

            } else if(button.value == ''){
                if(!isSinglePlayer){
                    //do player 2 stuff
                    button.style.backgroundImage = 'url(\'O.png\')';
                    button.value = 'o';
                    gameBoard[boardRow][boardCollumn] = 'o';

                    isPlayersTurn = true;

                } else{
                    //ai stuff whatver
                    
                    button.value = 'o';
                    isPlayersTurn = true;
                    
                }

                if(checkForWin('o')){
                    alert("player 2 win");
                }
            }
        }
        
    });
});

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
    function for checking if the game has ended
*/
function checkForWin(playerType){
    //check for row wins
    let numTiles = 0;
    for(let i = 1; i < 10; i++){
        let boardRow = getRow(i);
        let boardCollumn = getCollumn(i);

        if(gameBoard[boardRow][boardCollumn] == playerType){
            numTiles++;
        }

        if(numTiles == 3){
            gameIsRunning = false;  
            return true;
        }

        if(i % 3 == 0){
            numTiles = 0;
        }
    }

    return false;
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