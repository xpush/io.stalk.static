var _S_BK = {
  loadScript :  function(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
            script.readyState == "complete"){
          callback();
        }
      };
    } else {
      script.onload = function(){
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
}

_S_BK.loadScript('http://stalk.io/stalk.js', function(){
     STALK.init();
});

/*

javascript:(function(){var s = document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src='http://stalk.io/stalk.js?' + (+new Date()); setTimeout( function(){document.getElementById('tv-schedule').innerHTML= '';STALK.init({div:'tv-schedule', title:'현재 온라인으로 {title} 분이 시청하시고 있습니다.', fontFamily:'맑은 고딕,Malgun Gothic,Dotum,applegothic,sans-serif,arial'})}, 1500); })();

*/
