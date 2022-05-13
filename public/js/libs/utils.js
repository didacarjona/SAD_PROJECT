baseUrl='http://localhost:4344';
function startPolling(params){
 /* data={};
  continuar=true;
  for(let i=0; i<5 && continuar; i++){
    data=askUpdate(params);
    if(data!={}){
      continuar=false; 
    } 
    setTimeout(()=>{console.log('TIMEOUT FORA')},1000);
  }
  return data;*/
  setTimeout(()=>{console.log('TIMEOUT FORA')},10000);
  var dades;
  data=askUpdate(params, dades);
  return data;
}

function askUpdate(params){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dades=JSON.parse(this.responseText)[0];
            console.log(dades);
        }
    };
    xhttp.open("GET", baseUrl+"?signal=ask-for-update"+"?pin="+params.pin+"&user="+params.user, true);
    xhttp.send();
}



/*function ferRequest(url, callback) {
    var xhttp;
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this);
      }
   };
    xhttp.open("GET", url, true);
    xhttp.send();
  }*/