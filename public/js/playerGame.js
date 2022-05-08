var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url

function setPhotosVisible(){
    document.getElementById('stone_photo').style.visibility = "visible";
    document.getElementById('scissors_photo').style.visibility = "visible";
    document.getElementById('paper_photo').style.visibility = "visible";
}

function setPhotosHidden(){
    document.getElementById('stone_photo').style.visibility = "hidden";
    document.getElementById('scissors_photo').style.visibility = "hidden";
    document.getElementById('paper_photo').style.visibility = "hidden";
}

socket.on('connect', function() {            
    socket.emit('player-join-game', params);
    setPhotosVisible();
});

socket.on('noGameFound', function(){
    window.location.href = '../../';
});

function answerSubmitted(str){
    playerAnswered=false;
    if(playerAnswered == false){ //ens assegurem que no es respongui dos vegades
        playerAnswered = true;
        socket.emit('playerAnswer', str);         //Enviem resposta al servidor (NO FUNCIONA)
        setPhotosHidden();

        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Resposta enviada, esperant el teu oponent...";
    }
}

//Escoltem la resposta del servidor --> Hem guanyat?
socket.on('answerResult', function(data){
    if(data == true){
        correct = true; 
    }
});

socket.on('questionOver', function(data){
    if(correct == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct!";
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrect!";
    }
   setPhotosHidden();
   socket.emit('getScore');
});

//Actualitzem la puntuació
socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});
//Passem a la següent ronda
socket.on('nextQuestionPlayer', function(){
    correct = false;
    playerAnswered = false;
    
    setPhotosVisible();
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "white";
    
});
//Tornem a pantalla inicial si l'altre es desconecta
socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(let i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    setPhotosHidden();
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});