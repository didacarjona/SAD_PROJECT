baseUrl='http://localhost:4344';
var gamePin;

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
         dades=JSON.parse(this.responseText)[0];
         console.log(dades);
         gamePin=dades.pin;
         document.getElementById('gamePinText').innerHTML = gamePin;
         document.getElementById('waitingLabel').innerHTML = 'Esperant al contrincant...';
         updated_data=startPolling({pin:gamePin,user:'host'});
         if(updated_data!={}){
            document.getElementById('waitingLabel').innerHTML = 'Adversari preparat';
         };
    }
};
xhttp.open("GET", baseUrl+"?signal=host-waiting-player", true);
xhttp.send();
console.log('HTTP REQUEST CLIENT fet');

/*http.get(baseUrl+"?signal=host-waiting-player", (res)=>{
    console.log('HTTP REQUEST CLIENT fet');
    dades=processarResposta(res);    
    gamePin=dades.pin;
    document.getElementById('gamePinText').innerHTML = gamePin;
    document.getElementById('waitingLabel').innerHTML = 'Esperant al contrincant...';
} );*/

//Començem la partida si es clica el boto:                                       
function startGame(){   
    nickname=document.getElementById("name").value;
    points=document.getElementById("points").value;
    if(nickname!=""){
       /* socket.emit('startGame', {
            pin:gamePin,
            maxpoints:points
        });*/
        //window.location.href = '../';
        http.get(baseUrl+"?pin="+gamePin+"&nick="+nickname, );
    } else{
        document.getElementById('errorname').innerHTML="Posa un nom vàlid";  
        document.getElementById('name').focus(); 
    }
}

//Activa el botó de començar partida quan el contrincant s'hagi connectat
//socket.on('player-joined', ()=> {
//    document.getElementById('waitingLabel').innerHTML = "Adversari connectat";
//    document.getElementById('start').removeAttribute("disabled");
//});
//
////When server starts the game
//socket.on('gameStarted', function(){
//    console.log('Game Started!');
//    window.location.href="../player/game/index.html"+"?pin="+gamePin+"&nick="+nickname;
//});
//
//socket.on('gameStopped', function(){
//    window.location.href = '../../';//Tornem al començament
//});