var STALK_CONFIGURATION = {
  APP: 'stalk-io',
  APP_URL: 'http://chat.stalk.io:8000',
  CSS_URL: 'http://stalk.io/stalk.css',
  MESSAGE: {
    title: '',
  default_message: 'Welcome !  ',
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
  },


  setUserInfo : function(userInfo) {
		//var date = new Date();
		//date.setDate(date.getDate() + 10);
		document.cookie = 'STALK_USER=' + escape(JSON.stringify(userInfo)) + ';path=/';
		//';expires=' + date.toGMTString()+';path=/';
	},

	delUserInfo : function() {
		var date = new Date();
		var validity = -1;
		date.setDate(date.getDate() + validity);
		document.cookie = "STALK_USER=;expires=" + date.toGMTString()+';path=/';
	},

	getUserInfo : function() {
		var allcookies = document.cookie;
		var cookies = allcookies.split("; ");
		for ( var i = 0; i < cookies.length; i++) {
			var keyValues = cookies[i].split("=");
			if (keyValues[0] == "STALK_USER") {

				return JSON.parse(unescape(keyValues[1]));
			}
		}
		return {};
	},

  isIE : function(){
    return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
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
'          <a id="stalk_logoutbutton" class="stalk_button" style="display: none">X</a> ' +
'          <a id="stalk_oplink" class="stalk_panel_title_fg" > . . . . </a> ' +
'        </div> ' +
'      </div> ' +
''+
'      <div id="stalk_contents" style="display: none;"> ' +
'        <div id="stalk_body"> ' +
''+
'          <div id="stalk_conversation" class="stalk_conversation stalk_panel_height stalk_panel_bg" style="height: 200px; display: block;"></div>' +

'          <form id="stalk_chatform" action="#" method="GET" autocomplete="off" style="display: none;"> ' +
'            <div id="stalk_input" class="stalk_input "> ' +
'              <textarea id="stalk_input_textarea" name="stalk_input_textarea" size="undefined" class="stalk_input_textarea_pre stalk_input_textarea_normal" placeholder="Type here and hit &lt;enter&gt; to chat" style="line-height: 21px; height: 21px; display: block;"></textarea> ' +
'            </div> ' +
'          </form> ' +

'          <div id="stalk_loginform" style="display: block;">' +
'            <a href="#" onclick="return !window.open(STALK.getOAuthUrl(\'facebook\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=480\')" target="_blank" id="stalk_login_facebook"   class="stalk_login_button" style="background-position: -0px -88px; width: 64px; height: 34px">&nbsp;</a>' +
//'            <a href="#" onclick="return !window.open(STALK.getOAuthUrl(\'twitter\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=700,height=450\')" target="_blank" id="stalk_login_twitter"    class="stalk_login_button" style="background-position: -0px -148px; width: 64px; height: 64px">&nbsp;</a>' +
'            <a href="#" onclick="return !window.open(STALK.getOAuthUrl(\'google\'),\'STALK_OAUTH\',\'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=480\')" target="_blank" id="stalk_login_googleplus" class="stalk_login_button" style="background-position: -0px -14px; width: 64px; height: 34px">&nbsp;</a>' +
'          </div> ' +

'        </div> ' +
'        <div style="text-transform: uppercase; font-size: 9px; letter-spacing: 2px; font-weight: bold; padding: 8px 0px !important; font-family: helvetica, sans-serif !important; text-align: center !important; color: rgb(131, 136, 135) !important; clear: both;"> ' +
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
    var el_textarea  = document.getElementById('stalk_input_textarea');
    var div_logout   = document.getElementById('stalk_logoutbutton');


    if(STALK_CONFIGURATION._user.name) {
      self.setTitleBar('login');
    }

    div_logout.onclick = function(event){

      STALK_UTILS.delUserInfo();
      self.setTitleBar('logout');

      STALK_CONFIGURATION._user = {};

      event.preventDefault();
      event.stopPropagation();

    };

    div_titlebar.onclick = function(){

      if(div_contents.style.display != 'none'){
        div_contents.style.display = 'none';
				document.getElementById('stalk').className = 'stalk_status_compressed';
      }else{
        self.blinkHeader(true);
        div_contents.style.display = 'block';
				document.getElementById('stalk').className = 'stalk_status_expanded';

        self.focusTextarea();

        var div_message = document.getElementById('stalk_conversation');
        div_message.scrollTop = div_message.scrollHeight;

      }
    };

    el_textarea.onkeydown = function(e) {

      self.blinkHeader(true);

      var e = window.event || e;
      var keyCode = (e.which) ? e.which : e.keyCode;

      if(keyCode == 13 && !e.shiftKey) {

        if(e.preventDefault) {
          e.preventDefault();
        }else{
          e.returnValue = false;
        }

        var message = el_textarea.value;
        message = STALK_UTILS.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

        if(message.length > 0){

          STALK.sendMessage(encodeURIComponent(message));
          el_textarea.value = '';

        }
      }
    };

  },

  addMessage : function(message, from){

    var div_message = document.getElementById('stalk_conversation');

    if(from.id == STALK_CONFIGURATION._last_id){
      var messageId = from.id+'-'+STALK_CONFIGURATION._last_count;
      var sp_msg = document.getElementById(messageId);
      sp_msg.innerHTML = sp_msg.innerHTML+"<br>"+decodeURIComponent(message);

    }else{

      STALK_CONFIGURATION._last_id = from.id;
      STALK_CONFIGURATION._last_count = STALK_CONFIGURATION._last_count + 1;
      var messageId = STALK_CONFIGURATION._last_id+'-'+STALK_CONFIGURATION._last_count;

      var msg = '';
      msg = msg + '<span class="stalk_message_from stalk_message_fg ">'+
        '<a href="'+from.url+'" target="_blank">'+
        '<img src="'+from.image+'" style="width: 23px;" /></a> '+from.name+' :'+
        '</span>' +
        '<span id="'+messageId+'">'+decodeURIComponent(message)+'</span>';

      var chatDiv = document.createElement("p");
      chatDiv.className = 'stalk_message';
      chatDiv.innerHTML = msg;

      if(STALK_CONFIGURATION._user && STALK_CONFIGURATION._user.id == from.id ){
        chatDiv.style.textAlign = "right";
      }

      div_message.appendChild(chatDiv);
    }

    div_message.scrollTop = div_message.scrollHeight;

    if(document.getElementById('stalk_contents').style.display != 'block'){
      this.blinkHeader();
    }

  },

  addNotification : function(message) {
    STALK_CONFIGURATION._last_id = '';
    var chatDiv = document.createElement("p");
    chatDiv.className = 'stalk_message';
    chatDiv.innerHTML = '<span class="stalk_message_notification">'+message+'</span>';

    var div_message = document.getElementById('stalk_conversation');
    div_message.appendChild(chatDiv);
    div_message.scrollTop = div_message.scrollHeight;

  },

  addSysMessage : function(message) {
    STALK_CONFIGURATION._last_id = '';
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
  },

  focusTextarea : function(){


    if(STALK_UTILS.isIE()){
      setTimeout(function() {
        if(document.getElementById('stalk_chatform').style.display == 'block'){
          document.getElementById('stalk_input_textarea').focus();
        }
      }, 1000);
    }else{
      var el_textarea  = document.getElementById('stalk_input_textarea');
      el_textarea.focus();
      el_textarea.value = el_textarea.value;
    }

  },

  setTitleBar : function(_event, data){

    if(_event == 'login'){
      document.getElementById('stalk_logoutbutton').style.display = 'block';
      document.getElementById('stalk_chatform').style.display     = 'block';
      document.getElementById('stalk_loginform').style.display    = 'none';

      this.focusTextarea();

    }else if(_event == 'logout'){
      document.getElementById('stalk_logoutbutton').style.display = 'none';
      document.getElementById('stalk_chatform').style.display     = 'none';
      document.getElementById('stalk_loginform').style.display    = 'block';
      this.addNotification('Logout completely. Try logging on again.');

    }else if(_event == 'title'){
      document.getElementById('stalk_oplink').innerHTML = 'Online : '+data+'';

    }

  }

};


var STALK = (function(CONF, UTILS, WIN) {

  return {

    init: function(data) {

      if(CONF._isReady) return false;

      CONF._isReady = true;
      //CONF._userId  = data.userId || 'unknown';
      CONF._app     = CONF.APP; //+':'+location.hostname;
      CONF._channel = encodeURIComponent(location.hostname + location.pathname); //.substr(0);
      CONF._last_count = 0;

      if( !CONF._channel ) return;

      UTILS.loadCss( CONF.CSS_URL);
      UTILS.loadJson(CONF.APP_URL+'/node/'+encodeURIComponent(CONF._app)+'/'+encodeURIComponent(CONF._channel)+'?1=1', 'STALK.callbackInit');

    },

    callbackInit : function(data){

      if(data.status != 'ok') return;

      if(!data.result.server) return false;

      CONF._server = data.result.server;

      var query =
          'app='+CONF._app+'&'+
          'channel='+CONF._channel+'&'+
          'server='+data.result.server.name+'&'+
          //'userId='+CONF._userId+'&'+
          'deviceId=WEB&'+
          'mode=CHANNEL_ONLY';

      var _user = UTILS.getUserInfo();
      if(_user.name){
        CONF._user = _user;
      }else{
        CONF._user = {};
      }


      CONF._socket = io.connect(data.result.server.url+'/channel?'+query, {
      	'sync disconnect on unload': true,
        'force new connection': true
      });

      CONF._socket.on('connect', function () {

        /** create Chat window (HTML) **/
        if(!CONF._isCreate) {

          WIN.initWin();

          var initMessage = CONF.MESSAGE.default_message;
          if(!CONF._user.name){
            initMessage = initMessage + 'Try logging on for chatting.';
          }
          WIN.addSysMessage(initMessage);

        }

        CONF._isCreate = true;

      });

      CONF._socket.on('message', function (data) {

        WIN.addMessage(data.message, data.user);

/*
        if(data.sender){
          WIN.addMessage(data.message, data.sender);
        }else{
          WIN.addMessage(data.message);
        }
*/

      });

      CONF._socket.on('login-facebook', function (data) {

        CONF._user = {
          id: 'F'+data.id,
          name: data.displayName,
          url: data.profileUrl,
          image: 'https://graph.facebook.com/'+data.id+'/picture'
        };

        UTILS.setUserInfo(CONF._user);
        WIN.setTitleBar('login');

      });

      CONF._socket.on('login-google', function (data) {

        CONF._user = {
          id: 'G'+data.id,
          name: data.name,
          url: data.link,
          image: data.picture
        };

        UTILS.setUserInfo(CONF._user);
        WIN.setTitleBar('login');

      });

      CONF._socket.on('_event', function (data) {

        if (data.event == 'CONNECTION') {

          WIN.setTitleBar('title', data.count);

          /*if( data.userId == CONF._userId ) {

            WIN.addSysMessage(CONF.MESSAGE.default_message);

          }else{
            WIN.addSysMessage(data.userId + ' is connected.');
          }*/
        }else if (data.event == 'DISCONNECT') {

          WIN.setTitleBar('title', data.count);
          /*
          if( data.userId == 'CONF._userId' ) {
            WIN.addSysMessage('disconnected.');
          }else{
            WIN.addSysMessage(data.userId + ' was disconnected.');
          }*/

        }

      });

    },

    sendMessage : function(msg){
      var param = {
        app:      CONF._app,
        channel:  CONF._channel,
        name:     'message',
        data:     {
          user:     CONF._user,
          message:  msg
        }
      };

      CONF._socket.emit('send', param, function (data) {
      });
    },

    getOAuthUrl : function(targetName){
      return CONF.APP_URL + '/auth/'+targetName+'/check?app='+CONF._app+'&channel='+CONF._channel+'&socketId='+CONF._socket.socket.sessionid;
    }

  };


})(STALK_CONFIGURATION, STALK_UTILS, STALK_WINDOW);
