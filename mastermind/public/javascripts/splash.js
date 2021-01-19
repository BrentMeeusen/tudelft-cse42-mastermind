//@ts-check

document.getElementById("close-stats-popup").addEventListener("click", function() {
    toggleStats(false);
});


function toggleStats(forceOpen) {
    console.log("Wheee")
    document.getElementById("stats").classList.toggle("active", forceOpen);
}



/*
const playButton = document.getElementById("play");
playButton.onclick = function() {
    alert('Finding available player...');
}
*/

/*
let myVariable = document.querySelector('h1');
myVariable.textContent = 'MASTERMIND';
*/

/*
const div = document.querySelector('body');
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
div.style.width = winWidth + 'px';
div.style.height = winHeight + 'px';
window.onresize = function() {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    div.style.width = winWidth + 'px';
    div.style.height = winHeight + 'px';
  }
  */

