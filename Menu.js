// close app
document.getElementById("quit-button").addEventListener("click", function(e){
  e.preventDefault();
  window.close();
});

//statistics button
document.getElementById('statistics-button').addEventListener('click', function(){
    //update the statistics page
    updateStats();

    document.getElementById('statistics').style.visibility = 'visible'
})

function updateStats(){
  document.getElementById('TTT-player1-wins').textContent = 'Player 1 wins: ' + window.electronAPI.store.get('Player1Wins');
  document.getElementById('TTT-player2-wins').textContent = 'Player 2 wins: ' + window.electronAPI.store.get('Player2Wins');
  document.getElementById('TTT-games-tied').textContent = 'Games Tied: ' + window.electronAPI.store.get('gamesTied');
}
