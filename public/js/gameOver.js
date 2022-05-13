var params=parseUrl(window.location.href);
console.log("Wineer: " + params.winner);
console.log((params.winner=="false") ? "Has perdut! :(" : "Has guanyat! :)");
document.getElementById('title').innerHTML = "Final de la partida: "+(params.winner=="false") ? "Has perdut! :(" : "Has guanyat! :)";

function tornar(){
    window.location.href = '../../';//Tornem al començament
}
