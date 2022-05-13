function parseUrl(url){
   var rawparams=url.split('?');
   rawparams=rawparams[1].split('&');
   var params = {};
   for(let i=0;i<rawparams.length;i++){
       raw=rawparams[i].split('=');
       params[raw[0]]=raw[1];
   }
   console.log("PARAMS: "+params);
    //var url2 = new URL(url);
    //var params = {
    //    pin: url2.searchParams.get('pin'),
    //    nick: url2.searchParams.get('nick')
    //};

    return params;
}