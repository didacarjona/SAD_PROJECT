var params = parseUrl(window.location.href);
console.log(params);

if(params.winner == "true") {
    document.getElementById('label').innerHTML = ('Final de la partida: Has guanyat! :)');
    console.log("Has guanyat!");
} else {
    document.getElementById('label').innerHTML = ('Final de la partida: Has perdut! :(');
    console.log("Has perdut!");
}

function tornar(){
    window.location.href = '../../';//Tornem al començament
}
