var socket = io();
var playerAnswered = false;
var correct = false;
var adversary;
var score = 0;
var params=parseUrl(window.location.href);
var gamePin = params.pin;

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

socket.on('initialData', function(data){
    adversary = data.nick;
    document.getElementById('nameText').innerHTML = "Noms: "+ params.nick + " vs " + adversary;
    console.log("Posem els noms!");
});

socket.on('noGameFound', function(){
    window.location.href = '../../';
});

function answerSubmitted(str){
    playerAnswered = true;
    socket.emit('playerAnswer', {
        answer: str,
        pin: gamePin
    });
    setPhotosHidden();
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "Resposta enviada, esperant el teu oponent...";
}

//Escoltem la resposta del servidor --> Hem guanyat?
socket.on('answerResult', function(data){
    /*if(data == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Has guanyat!";
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Has perdut"; 
    }
    socket.emit('getScore');*/
    document.getElementById('scoreText').innerHTML = "Puntuacions: "+data.player +" - "+data.adversary;
    document.getElementById('message').innerHTML = "";
    setPhotosVisible();
});


//Tornem a pantalla inicial si l'altre es desconecta
socket.on('gameStopped', function(){
    window.location.href = "../../";
});

/*
socket.on('gameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    setPhotosHidden();
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});*/