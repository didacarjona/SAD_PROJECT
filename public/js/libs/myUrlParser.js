function parseUrl(url){
    // var rawparams=url.split('?');
    // rawparams=rawparams.split('&');
    // var params = {};
    // for(let i=1;i<rawparams.length;i++){
    //     raw=rawparams[i].split('=');
    //     params[raw[0]]=raw[1];
    // }
    var url2 = new URL(url);
    var params = {
        pin: url2.searchParams.get('pin'),
        nick: url2.searchParams.get('nick')
    };

    return params;
}