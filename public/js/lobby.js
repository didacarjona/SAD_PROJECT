baseUrl='http://localhost:4344';
var socket = io();
var params;

//Quan jugador es connecta al servidor:
socket.on('connect', function() {  
    params = parseUrl(window.location.href); //Extraiem les dades de la URL
    //Enviem senyal al servidor confor-me ha arribat un jugador
    socket.emit('player-join', params);
    console.log(params);
});
//Si el pin de la partida no fa match retorna a pantalla d'inici
socket.on('noGameFound', function(){
    window.location.href = '../';
});
//Si el host es desconecta retorna a la pantall d'inici
socket.on('gameStopped', function(){
    window.location.href = '../';
});
//Quan el host comença la partida anem a la pantalla
socket.on('gameStarted', function(){
    console.log("Comencem el joc!");
    window.location.href="/player/game/"+"?pin="+params.pin+"&nick="+params.nick;
});