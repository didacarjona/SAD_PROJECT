var socket = io();
var params = jQuery.deparam(window.location.search);

//When host connects to server
socket.on('connect', function() {
    
    //Tell server that it is host connection
    socket.emit('host-waiting-player');
});

socket.on('showGamePin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
   document.getElementById('waitingLabel').innerHTML = 'Esperant al contrincant';
});


//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGame');
}
function endGame(){
    window.location.href = "/";
}

//When server starts the game
socket.on('gameStarted', function(id){
    console.log('Game Started!');
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});