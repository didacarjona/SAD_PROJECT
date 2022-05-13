http = require('http');  
fs=require('fs').promises;
const { read } = require('fs');
const { parse } = require('path');
const url = require ('url');

var params='';
var games = new Map();

const hostname = "localhost";  
const port =  4344;  
var user= ''; 

const requestListener = function(req,res){
    console.log("New connecion");
    console.log(req.url);
    var baseUrl=req.url;

    if(req.method =='GET'){
            var doc="";
            var type="text/html";
            if(req.url.includes("css")){
                type="text/css";
            } else if(req.url.includes("js")){
                type="application/javascript";
            } else{
                doc="index.html";
            }
            
            if(req.url.includes('?')){
                params=parseUrl(req.url);
                baseUrl=req.url.split('?')[0];
                processarSignal(params,res);
            }
            console.log("./public"+baseUrl+doc);
            fs.readFile("./public"+baseUrl+doc)
                .then(contents => {
                    res.setHeader("Content-Type", type);
                    res.writeHead(200);
                    res.end(contents);
                })
                .catch(err => {
                    //res.writeHead(500);
                    res.end("error");
                    return;
                });
    }
}

function processarSignal(params,res){
   try {
    console.log("SENYAL_IN: "+params.signal.toString());
   } catch (error) {
       
   } 
    switch(params.signal){
        case 'host-waiting-player':
            gamePin = Math.floor(Math.random()*90000) + 10000;
            game=createGame(gamePin);
            games.set(gamePin,game);
            console.log('Joc creat amb el pin: ', gamePin);
            enviarResposta({pin:gamePin},res);
            break;

        case 'player-join':
            var game = games.get(parseInt(params.pin));
            if(game != undefined) {
                console.log("Jugador connectat i joc "+gamePin+" trobat");
                game.player_joined = true;
                //socket.to(gamePin).emit('player-joined');
                game.pendent_data_host['player-joined']="true";
                enviarResposta({},res);
            } else {
                enviarResposta({not_found:""},res);
                console.log("Joc no trobat!");
            }
            break;

        case 'ask-for-update':
            var game = games.get(parseInt(params.pin));
           // if(params.user == "host"){
           //     if(params.status=="waiting-player" && game.pendent_data_host['player-joined']!=undefined){
           //         enviarResposta(game.pendent_data_host,res);
           //     }
           // }
           if(game!=undefined){
                if(params.user=='host'){
                    console.log('PendentDataHost SENDED');
                    enviarResposta(game.pendent_data_host,res);
                } else{
                    enviarResposta(game.pendent_data_player,res);
                }
            }
    }
}

function enviarResposta(object,res){
    data=JSON.stringify([object]); 
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(data);
}

function createGame(gamePin){
    return game = {
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
        max_points: 0,
        pendent_data_host: {},
        pendent_data_player: {}
    }
}

const server = http.createServer(requestListener);
server.listen (port, hostname, () =>{  
  console.log('Server running at http://%s:%d',hostname,port)
});

function parseUrl(url){
    var rawparams=url.split('?');
    rawparams=rawparams[1].split('&');
    var params = {};
    for(let i=0;i<rawparams.length;i++){
        raw=rawparams[i].split('=');
        params[raw[0]]=raw[1];
    }
    return params;
 }