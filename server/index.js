const express = require("express");
const path = require('path');
const http = require('http');
const cors = require("cors");
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var games = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath)); //Ens diu la ruta root

require("dotenv").config();

//--------------------------------------------------------------------------------

// Encenent el servidor al port 9000
const server = app.listen(process.env.PORT,()=> {
    console.log(`Servidor escoltant al port ${process.env.PORT}`)
});

// Quan hi hagi una connexió des d'un client
io.on('connection', (socket) => {

    //1.Quan el host crea la partida i espera a l'altre jugador
    socket.on('host-waiting-player', (data) => {
        var gamePin = Math.floor(Math.random()*90000) + 10000; // Genera un PIN aleatori per la partida
        var game = {
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

    //2.Quan el host comença la partida


    //1.Quan un player es connecta amb el PIN


    //2.Quan un player s'uneix a la partida




}

