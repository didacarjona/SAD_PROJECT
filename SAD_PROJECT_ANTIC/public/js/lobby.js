var socket = io();

//Quan jugador es connecta al servidor:
socket.on('connect', function() {  
    var params = jQuery.deparam(window.location.search); //Extraiem les dades de la URL
    //Enviem senyal al servidor confor-me ha arribat un jugador
    socket.emit('player-join', params);
});
//Si el pin de la partida no fa match retorna a pantalla d'inici
socket.on('noGameFound', function(){
    window.location.href = '../';
});
//Si el host es desconecta retorna a la pantall d'inici
socket.on('hostDisconnect', function(){
    window.location.href = '../';
});
//Quan el host comença la partida anem a la pantalla
socket.on('gameStartedPlayer', function(){
    window.location.href="/player/game/" + "?id=" + socket.id;
});