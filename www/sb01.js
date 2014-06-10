var _S_BK = {
  loadScript :  function(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
            script.readyState == "complete"){
          //script.onreadystatechange = null;
          callback();
        }
      };
    } else {  //Others
      script.onload = function(){
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
}

_S_BK.loadScript('http://link.stalk.io/stalk.js', function(){
     var conf = {
          key: 'xk_EreBJ6',
          id: 'SeoulCallCenter'
         // userId: 'Your Client ID'
     };
     STALK.init(conf);
});

