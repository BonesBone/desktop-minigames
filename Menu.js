const { ipcRenderer } = require('electron');
const Store = require('electron-store');

const store = new Store();
// close app
document.getElementById("quit-button").addEventListener("click", (e) => {
  e.preventDefault();
  window.close();
});


statisticsUI = document.getElementById('statistics')
settingsUI = document.getElementById('settings')

//statistics button
document.getElementById('statistics-button').addEventListener('click', () => {
    //update the statistics page
    updateStats();
    statisticsUI.style.visibility = 'visible'
})

//settings button
document.getElementById('settings-button').addEventListener('click', () => {
    settingsUI.style.visibility = 'visible'
})

// settingsUI.addEventListener('click', () => {
//   if(settingsUI.style.visibility == 'visible'){
//     settingsUI.style.visibility = 'hidden'
//   }
// })

statisticsUI.addEventListener('click', () => {
  if(statisticsUI.style.visibility == 'visible'){
    statisticsUI.style.visibility = 'hidden'
  }
})


resetButton = document.getElementById("reset-button")
resetButton.addEventListener('click', () => {
  window.ipcRenderer.openDialog('openDialog');
  window.ipcRenderer.dialogResponse((event, response) => {
    if (response === 0) {
        // Perform your render action here
        alert("ye")
    }
  });
  
})


function updateStats(){
  document.getElementById('TTT-player1-wins').textContent = 'Player 1 wins: ' + store.get('Player1Wins', '--')
  document.getElementById('TTT-player2-wins').textContent = 'Player 2 wins: ' + store.get('Player2Wins', '--')
  document.getElementById('TTT-games-tied').textContent = 'Games Tied: ' + store.get('gamesTied', '--')
}
