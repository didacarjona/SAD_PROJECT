baseUrl='http://localhost:4344';
function onJoinClicked(){
    nick = document.getElementById('name').value;
    pin = document.getElementById('pin').value;
    //window.location.href="/player/index.html" + "?pin=" + pin +"&nick="+nick;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dades=JSON.parse(this.responseText)[0];
            console.log(dades.toString);
            if(dades.not_found==undefined){
                console.log('Esperant que host començi la partida...');
            }
            goToLobby();
        }
    };
    xhttp.open("GET", baseUrl+"?signal=player-join"+"&pin="+pin+"&nick="+nick, true);
    xhttp.send();
    console.log('JOIN REQUEST FET');
}

function goToLobby(){
    /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
        }
    };
    xhttp.open("GET", baseUrl, true);
    xhttp.send();*/
    window.location.href = baseUrl+'/player/';
}