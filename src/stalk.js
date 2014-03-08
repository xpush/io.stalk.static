var STALK_CONFIGURATION = {
  APP: 'stalk-io',
  APP_URL: 'http://stalk.xpush.io:8000',
  CSS_URL: 'http://stalk.xpush.io:8000/public/stalk.css',
  MESSAGE: {
    title: 'Leave us a Message',
    default_message: 'Questions? Come chat with us! We\'re here, send us a message!',
    
    
  }
};


var STALK_UTILS = {
  getUniqueKey : function () {
    var s = [], itoh = '0123456789ABCDEF';
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random()*0x10);
    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;
   
    for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
    s[8] = s[13] = s[18] = s[23] = '-';
   
    return s.join('');
  },
  getEscapeHtml : function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  },
  getHashCode : function (s) {
    var hash = 0;
    if (s.length === 0) return hash;
    for (var i = 0; i < s.length; i++) {
      var char1 = s.charCodeAt(i);
      hash = ((hash<<5)-hash)+char1;
      hash = hash & hash;
    }
    return hash;
  },
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
  },

  loadCss : function (url) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    return link;
  },
  
  loadJson : function(url, callbackStr){
    var script = document.createElement("script");
    // Add script object attributes
    script.type     = "text/javascript";
    script.charset  = "utf-8";
    script.id       = this.getHashCode(url);

    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
            script.readyState == "complete"){
          //script.onreadystatechange = null;
          // DO Something?
        }
      };
    } else {  //Others
      script.onload = function(){
        // DO Something?
      };
    }
    script.src = url + '&callback='+callbackStr+'&_noCacheIE=' + (new Date()).getTime();
    document.getElementsByTagName("head")[0].appendChild(script);
  },
  
  hasClass : function(el, val) {
    var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
    return pattern.test(el.className);
  },
  addClass : function(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  },
  removeClass : function(ele, cls) {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  }
  
};


var STALK_WINDOW = {
  initWin : function(){

    var div_root = document.createElement('div');
    div_root.id = 'stalk';
    div_root.className = 'stalk_status_compressed';
    div_root.innerHTML = 
'  <div id="stalk_window" style="margin: 0px 20px; bottom: 0px; right: 0px; display: none; position: fixed;" class="stalk_window_base stalk_window_width stalk_window_fixed_bottom stalk_window_fixed_right "> ' +
'    <div id="stalk_panel" class="stalk_panel_border stalk_panel_bg" style="display: block;"> ' +
''+      
'     <div id="stalk_title" style="display: block;"> ' +
'        <div id="stalk_topbar" class="stalk_panel_title_fg stalk_panel_title_bg"> ' +
'          <a id="stalk_sizebutton" class="stalk_button">^</a> ' +
'          <a id="stalk_oplink" class="stalk_panel_title_fg">Leave us a Message</a> ' +
'        </div> ' +
'      </div> ' +
''+      
'      <div id="stalk_contents" style="display: none;"> ' +
'        <div id="stalk_body"> ' +
''+     
'          <div id="stalk_conversation" class="stalk_conversation stalk_panel_height stalk_panel_bg" style="height: 200px; display: block;"></div>' +
          
'          <form id="stalk_chatform" action="#" method="GET" autocomplete="off" style="display: block;"> ' +
'            <div id="stalk_input" class="stalk_input "> ' +
'              <textarea id="stalk_input_textarea" name="stalk_input_textarea" size="undefined" class="stalk_input_textarea_pre stalk_input_textarea_normal" placeholder="Type here and hit &lt;enter&gt; to chat" style="line-height: 21px; height: 21px; display: block;"></textarea> ' +
'            </div> ' +
'          </form> ' +
          
'        </div> ' +
'        <div style="text-transform: uppercase; font-size: 9px; letter-spacing: 2px; font-weight: bold; padding: 8px 0px !important; font-family: helvetica, sans-serif !important; text-align: center !important; color: rgb(131, 136, 135) !important; clear: both;"> ' +
'          Powered By ' +
'          <a style="font-family: helvetica, sans-serif !important; text-transform: uppercase; font-size: 9px !important; letter-spacing: 2px; font-weight: bold; color: #c9362f !important; text-decoration: none; text-align:center !important;" ' +
'          href="http://stalk.io" target="_blank">stalk.io</a> ' +
'        </div> ' +
'      </div> ' +
''+
'    </div> ' +
'    <div style="display: none;"></div> ' +
'  </div> ';

    document.getElementsByTagName('body')[0].appendChild(div_root);

    var self = this;
    var div_titlebar = document.getElementById('stalk_title');
    var div_contents = document.getElementById('stalk_contents');
    var div_chatform = document.getElementById('stalk_chatform');
    var el_textarea  = document.getElementById('stalk_input_textarea');

    div_titlebar.onclick = function(){
      
      if(div_contents.style.display != 'none'){
        div_contents.style.display = 'none';
        div_chatform.style.display = 'none';
				document.getElementById('stalk').className = 'stalk_status_compressed';
      }else{
        div_contents.style.display = 'block';
        div_chatform.style.display = 'block';
				document.getElementById('stalk').className = 'stalk_status_expanded';
        
        el_textarea.focus();
        el_textarea.value = el_textarea.value;
      }
    };
    
    el_textarea.onkeydown = function(event) {
      self.blinkHeader(true);

      if(event.keyCode == 13 && !event.shiftKey) {

        if(event.preventDefault) {
          event.preventDefault();
        }else{
          event.returnValue = false;
        }

        var message = el_textarea.value;
        message = STALK_UTILS.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

        if(message.length > 0){

          STALK.sendMessage(
          {
            message : encodeURIComponent(message)
          }
          );
          el_textarea.value = '';

        }
      }
    };
    
  },
  
  addMessage : function(message, from){
    
    var msg = '';
    if(from){
      msg = msg + '<span class="stalk_message_from stalk_message_fg ">'+from+' :</span>';
    }else{
      msg = msg + '<span class="stalk_message_me stalk_message_fg ">→</span>';
    }
    msg = msg + '<span>'+decodeURIComponent(message)+'</span>';
        
    var chatDiv = document.createElement("p");
    chatDiv.className = 'stalk_message';
    chatDiv.innerHTML = msg;
    
    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

    if(document.getElementById('stalk_contents').style.display != 'block'){
      this.blinkHeader();
    }

  },

  addNotification : function(message) {
    var chatDiv = document.createElement("p");
    chatDiv.className = 'stalk_message';
    chatDiv.innerHTML = '<span class="stalk_message_notification">'+message+'</span>';

    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

    if(document.getElementById('stalk_contents').style.display != 'block'){
      this.blinkHeader();
    }
  },

  addSysMessage : function(message) {
    var chatDiv = document.createElement("span");
    chatDiv.className = 'stalk_message_note';
    chatDiv.innerHTML = message;

    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

  },
  
  blinkTimeout : '',
  blinkHeader : function(isDone){
    if(isDone){
      clearInterval(this.blinkTimeout);
      var titleDivForBlick = document.getElementById('stalk_topbar');
      STALK_UTILS.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
    }else{
      clearInterval(this.blinkTimeout);
      this.blinkTimeout =
        setInterval(function(){
          var titleDivForBlick = document.getElementById('stalk_topbar');
          if(STALK_UTILS.hasClass(titleDivForBlick, 'stalk_panel_title_bg_blink')){
            STALK_UTILS.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
          }else{
            STALK_UTILS.addClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
          }
        },1000);
    }
  }
  
};


var STALK = (function(CONF, UTILS, WIN) {

  return {

    init: function(data) {

      if(CONF._isReady) return false; 

      CONF._isReady = true;
      CONF._userId  = data.userId || 'unknown';
      CONF._app     = CONF.APP+':'+data.key;
      CONF._channel = UTILS.getUniqueKey()+'^'+data.id+'^'+CONF._userId;

      if( !CONF._channel ) return;

      UTILS.loadCss( CONF.CSS_URL);
      UTILS.loadJson(CONF.APP_URL+'/node/'+encodeURIComponent(CONF._app)+'/'+CONF._channel+'?1=1', 'STALK.callbackInit');

    },

    callbackInit : function(data){

      if(data.status != 'ok') return;

      CONF._server = data.server;

      if(!data.result.server) return false;

      var query = 
          'app='+CONF._app+'&'+
          'channel='+CONF._channel+'&'+
          'server='+data.result.server.name+'&'+
          'userId='+CONF._userId+'&'+
          'deviceId=WEB&'+
          'mode=CHANNEL_ONLY';

      CONF._socket = io.connect(data.result.server.url+'/channel?'+query, {
        'force new connection': true
      });

      CONF._socket.on('connect', function () {
        
      });
      
      CONF._socket.on('message', function (data) {
      	if(data.from){
      	  WIN.addMessage(data.message, data.from);	
      	}else{
      	  WIN.addMessage(data.message);	
      	}
        
      });

      CONF._socket.on('_event', function (data) {
        if (data.event == 'CONNECTION') {
          WIN.addSysMessage(CONF.MESSAGE.default_message);
        }else if (data.event == 'DISCONNECT') {
          WIN.addSysMessage('disconnected.');
        }


      });

      WIN.initWin();

    },
    
    sendMessage : function(msg){
      var param = {
        app:      CONF._app,
        channel:  CONF._channel,
        name:     'message',
        data:     msg };

			CONF._socket.emit('send', param, function (data) {
      });
    }

  };
  
  
})(STALK_CONFIGURATION, STALK_UTILS, STALK_WINDOW);
