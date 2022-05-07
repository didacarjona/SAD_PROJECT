
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);



app.use(express.static(publicPath));

//Starting server on port 3000
server.listen(9000, () => {
    console.log("Server started on port 9000");
});


//When a connection to server is made from client
io.on('connection', (socket) => {

    //1.Quan el host crea la partida i espera a l'altre jugador
    socket.on('host-waiting-player', (data) => {
        var gamePin = Math.floor(Math.random()*90000) + 10000; // Genera un PIN aleatori per la partida
        var game = {
            host_id: 0,
            player_id: 0,
            host_points: 0,
            player_points: 0,
        }
        games.set(gamePin,game);
        socket.join(gamePin); // Afegim l'usuari a una 'sala' amb el socket
        console.log('Joc creat amb el pin: ', gamePin);
        socket.emit('showGamePin', {
            pin: gamePin
        });
    });

    //2. El jugador entra a la sala d'espera
    socket.on('host-waiting-player', (data) => {

    });


    //3.Quan el host comença la partida
    socket.on('host-started-the-game', (data) => {
        socket.to(data.gamePin).emit('gameStarted'); // Digali al jugador que el host ha començat la partida
    });

});
