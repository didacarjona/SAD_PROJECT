
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var games = new Map();

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
            pin: gamePin,
            host_id_set: false,
            player_joined: false,
            starting_game: false,
            host_id: 0,
            player_id: 0,
            host_name: "",
            player_name: "",
            host_points: 0,
            player_points: 0,
            pendent_result_host: "",
            pendent_result_player: "",
            hostHasWon: false,
            max_points: 0
        }
        game.host_id = socket.id;
        games.set(gamePin,game);
        socket.join(gamePin); // Afegim l'usuari a una 'sala' amb el socket
        console.log('Joc creat amb el pin: ', gamePin);
        socket.emit('showGamePin', {
            pin: gamePin,
        });
    });

    //2. El jugador entra a la sala d'espera
    socket.on('player-join', (data) => {
        var gameFound = false;
        var gamePin = parseInt(data.pin);
        var game = games.get(gamePin);
        if(game != undefined && !game.player_joined) {
            console.log("Jugador connectat i joc "+gamePin+" trobat");
            game.player_id = socket.id;
            game.player_joined = true;
            socket.join(gamePin);
            socket.to(gamePin).emit('player-joined');
        } else {
            socket.emit('noGameFound');
            console.log("Joc no trobat!");
        }
    });

    //3.Quan el host comença la partida
    socket.on('startGame', (data) => {
        var game = games.get(parseInt(data.pin));
        game.max_points=data.maxpoints;
        console.log("Enviem als jugadors que comencem el joc" + game.max_points);
        game.starting_game = true; // Activa el flag per dir que quan es tanqui el socket per iniciar el joc, el servidor no es pensi que estem sortint del joc
        io.in(parseInt(data.pin)).emit('gameStarted'); // Digali al host i jugador que la partida s'està iniciant
    });


    //---- Si el host o el jugador se'n van de la partida
    socket.on('disconnect', ()=>{
        var game;
        for(let pin of games.keys()) {
            game = games.get(pin);
            if((game.host_id == socket.id || game.player_id == socket.id) && !game.starting_game) {
                console.log("El host o el jugador se n'ha anat");
                games.delete(pin);
                io.in(pin).emit('gameStopped');
            }
            socket.leave(pin);
        }
    });


    //4. Quan el host/player entra desde la sala del joc es reconfiguren els sockets ID (dona igual ja la diferencia entre host y player)
    socket.on('player-join-game', (data)=>{
        var game = games.get(parseInt(data.pin));
        socket.join(parseInt(data.pin));
        if(game != undefined) {
            if(game.host_id_set == false) {
                game.host_id = socket.id;
                game.host_name = data.nick;
                game.host_id_set = true;
            } else {
                game.player_id = socket.id;
                game.player_name = data.nick;
                game.starting_game = false;
                socket.to(parseInt(data.pin)).emit('initialData', {
                    nick: game.player_name
                });
                socket.emit('initialData', {
                    nick: game.host_name
                });
            }
        } else {
            socket.emit('gameStopped');
        }
        console.log(game);
    });

    //5. El host o el player envien la seva resposta i li contestem amb el resultat
    socket.on('playerAnswer', (data) => {

        var game = games.get(parseInt(data.pin));
        var its_host = false;
        var hostHasWon = false;
        if(game.host_id == socket.id) {
            game.pendent_result_host = data.answer;
            console.log("El host ha registrado " + data.answer);
            its_host = true;
        } else {
            console.log("El player ha registrado " + data.answer);
            game.pendent_result_player = data.answer;
        }

        var empate = false;

        if(game.pendent_result_host != "" && game.pendent_result_player != "") {
            if (game.pendent_result_host == "pedra" && game.pendent_result_player == "tisores") {
                game.host_points = game.host_points + 1;
                hostHasWon = true;
            } else if (game.pendent_result_host == "paper" && game.pendent_result_player == "pedra") {
                game.host_points = game.host_points + 1;
                hostHasWon = true;
            } else if (game.pendent_result_host == "tisores" && game.pendent_result_player == "paper") {
                game.host_points = game.host_points + 1;
                hostHasWon = true;
            } else if (game.pendent_result_host != game.pendent_result_player) {
                game.player_points = game.player_points + 1;
            } else {
                empate = true;
            }
            console.log("Puntuacio host:" +game.host_points);
            console.log("Puntuacio maxima:" +game.max_points);
            game.pendent_result_host = "";
            game.pendent_result_player = "";

            if(its_host == true) {
                var scores = {
                    player: game.host_points,
                    adversary: game.player_points,
                    youHaveWon: hostHasWon,
                    empat: empate
                };
                socket.emit('answerResult', scores);
                scores = {
                    player: game.player_points,
                    adversary: game.host_points,
                    youHaveWon: !hostHasWon,
                    empat: empate
                };
                socket.to(parseInt(game.pin)).emit('answerResult', scores);
            } else {
                var scores = {
                    player: game.player_points,
                    adversary: game.host_points,
                    youHaveWon: !hostHasWon,
                    empat: empate
                };
                socket.emit('answerResult', scores);
                scores = {
                    player: game.host_points,
                    adversary: game.player_points,
                    youHaveWon: hostHasWon,
                    empat: empate
                };
                socket.to(parseInt(game.pin)).emit('answerResult', scores);
            }

            if(game.player_points==game.max_points){
                game.starting_game = true;
                io.in(parseInt(game.pin)).emit('gameOver', {
                    winner: game.player_name
                });
            } else if(game.host_points==game.max_points){
                game.starting_game = true;
                io.in(parseInt(game.pin)).emit('gameOver', {
                    winner: game.host_name
                });
            }
            console.log(game);
        }
    });
});
