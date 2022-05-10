var socket = io();

function startGame(){
    window.location.href="/player/game/" + "?id=" + socket.id;
}

function onCreateClick(){
    socket.emit('...');
    
}