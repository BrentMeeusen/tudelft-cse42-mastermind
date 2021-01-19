//@ts-check
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.add("show");
    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.background = 'white';
    closeButton.style.fontFamily = 'Bungee Shade';
    closeButton.style.borderColor = '#AB23E0';
    closeButton.style.borderWidth = "10px";
    closeButton.style.borderRadius = '50%';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '70px';
    closeButton.style.top = '45px';
    popup.appendChild(closeButton);
    closeButton.onclick = function() {
        popup.remove();
    }
}

function myFunctionFirst() {
    var popup = document.getElementById("myPopupFirst");
    popup.classList.add("show");
    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.background = 'white';
    closeButton.style.fontFamily = 'Bungee Shade';
    closeButton.style.borderColor = '#AB23E0';
    closeButton.style.borderWidth = "10px";
    closeButton.style.borderRadius = '50%';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '70px';
    closeButton.style.top = '45px';
    popup.appendChild(closeButton);
    var popup1 = popup;
    closeButton.onclick = function() {
        popup.remove();
    }
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

