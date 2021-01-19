//@ts-check

document.getElementById("close-stats-popup").addEventListener("click", function() {
    toggleStats(false);
});


function toggleStats(forceOpen) {
    document.getElementById("stats").classList.toggle("active", forceOpen);
}


document.getElementById("close-howto-popup").addEventListener("click", function() {
    toggleStats2(false);
});


function toggleStats2(forceOpen) {
    document.getElementById("rules").classList.toggle("active", forceOpen);
}

