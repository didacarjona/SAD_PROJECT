var socket = io();
var nickname;
var gamePin;

//Quan host es conecta al server, avisem que estem esperant
socket.on('connect', function() {
    socket.emit('host-waiting-player');
});

socket.on('showGamePin', function(data){
   gamePin=parseInt(data.pin);
   document.getElementById('gamePinText').innerHTML = gamePin;
   document.getElementById('waitingLabel').innerHTML = 'Esperant al contrincant...';  
});

//Començem la partida si es clica el boto:                                       
function startGame(){   
    nickname=document.getElementById("name").value;
    points=document.getElementById("points").value;
    if(nickname!=""){
        socket.emit('startGame', {
            pin:gamePin,
            maxpoints:points
        });
    } else{
        document.getElementById('errorname').innerHTML="Posa un nom vàlid";  
        document.getElementById('name').focus(); 
    }
}

function cancel() {
    window.location.href = '../../';
}

//Activa el botó de començar partida quan el contrincant s'hagi connectat
socket.on('player-joined', ()=> {
    document.getElementById('waitingLabel').innerHTML = "Adversari connectat";
    document.getElementById('start').removeAttribute("disabled");
});

//When server starts the game
socket.on('gameStarted', function(){
    console.log('Game Started!');
    window.location.href="../player/game/index.html"+"?pin="+gamePin+"&nick="+nickname;
});

socket.on('gameStopped', function(){
    window.location.href = '../../';//Tornem al començament
});