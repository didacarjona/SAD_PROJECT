function onJoinClicked(){
    console.log("Unirse apretado");
    nick = document.getElementById('name').value;
    pin = document.getElementById('pin').value;
    window.location.href="/player/index.html" + "?pin=" + pin +"&nick="+nick;
}