const Store = require('electron-store');

const store = new Store();
// close app
document.getElementById("quit-button").addEventListener("click", function(e){
  e.preventDefault();
  window.close();
});

//statistics button
statisticsUI = document.getElementById('statistics')
document.getElementById('statistics-button').addEventListener('click', function(){
    //update the statistics page
    updateStats();

    statisticsUI.style.visibility = 'visible'
})

statisticsUI.addEventListener('click', function(){
  if(statisticsUI.style.visibility == 'visible'){
    statisticsUI.style.visibility = 'hidden'
  }
})

function updateStats(){
  document.getElementById('TTT-player1-wins').textContent = 'Player 1 wins: ' + store.get('Player1Wins');
  document.getElementById('TTT-player2-wins').textContent = 'Player 2 wins: ' + store.get('Player2Wins');
  document.getElementById('TTT-games-tied').textContent = 'Games Tied: ' + store.get('gamesTied');
}
