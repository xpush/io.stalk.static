(function (global) {

  var root = global;

  // 1. private variable (using this scope)
  var version = '1.0';
  var _CONFIG = {
    div: undefined,
    app_id: 'stalk:public',
    server_url: 'http://chat.stalk.io:8000',
    css_url: 'http://stalk.io/stalk.css',
    height: '200px',
    width: '300px',
    fontFamily: undefined,
    titleColor: undefined,
    channel: undefined,
    message: {
      title: 'Online : {title}',
      welcome: 'Welcome !'
    },
    _isCreate: false
  };

  // 2. internal utils functions
  var utils = {
    getUniqueKey: function () {
      var s = [], itoh = '0123456789ABCDEF';
      for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
      s[14] = 4;
      s[19] = (s[19] & 0x3) | 0x8;
      for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
      s[8] = s[13] = s[18] = s[23] = '-';
      return s.join('');
    },
    getEscapeHtml: function (html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    getHashCode: function (s) {
      var hash = 0;
      if (s.length === 0) return hash;
      for (var i = 0; i < s.length; i++) {
        var char1 = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char1;
        hash = hash & hash;
      }
      return hash;
    },
    loadScript: function (url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) {  //IE
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" ||
            script.readyState == "complete") {
            callback();
          }
        };
      } else {  //Others
        script.onload = function () {
          callback();
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    loadCss: function (url) {
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
      return link;
    },
    loadJson: function (url, callbackStr) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.id = this.getHashCode(url);
      if (script.readyState) {  //IE
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" ||
            script.readyState == "complete") {
          }
        };
      } else {
        script.onload = function () {
          // DO Something?
        };
      }
      script.src = url + '&callback=' + callbackStr + '&_noCacheIE=' + (new Date()).getTime();
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    hasClass: function (el, val) {
      var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
      return pattern.test(el.className);
    },
    addClass: function (ele, cls) {
      if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    },
    removeClass: function (ele, cls) {
      if (this.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
      }
    },
    setUserInfo: function (userInfo) {
      document.cookie = 'STALK_USER=' + escape(JSON.stringify(userInfo)) + ';path=/';
    },
    delUserInfo: function () {
      var date = new Date();
      var validity = -1;
      date.setDate(date.getDate() + validity);
      document.cookie = "STALK_USER=;expires=" + date.toGMTString() + ';path=/';
    },
    getUserInfo: function () {
      var allcookies = document.cookie;
      var cookies = allcookies.split("; ");
      for (var i = 0; i < cookies.length; i++) {
        var keyValues = cookies[i].split("=");
        if (keyValues[0] == "STALK_USER") {
          return JSON.parse(unescape(keyValues[1]));
        }
      }
      return {};
    },
    isIE: function () {
      return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    },
    mergeConfig: function (obj1, obj2) {

      for (var p in obj2) {
        try {
          if (obj2[p].constructor == Object) {
            obj1[p] = this.mergeConfig(obj1[p], obj2[p]);
          } else {
            obj1[p] = obj2[p];
          }
        } catch (e) {
          obj1[p] = obj2[p];

        }
      }
      return obj1;
    }
  };

// 3. DOM Handler

  var layout = {

    initWin: function () {

      var isEmbeded = _CONFIG.div ? true : false;

      var _height = isEmbeded ? (document.getElementById(_CONFIG.div).clientHeight - 106) + 'px!important' : _CONFIG.height || '!important';
      var _width = isEmbeded ? '100%; min-width: 100%' : _CONFIG.width || 'px!important';
      var _fontFamily = _CONFIG.fontFamily;
      var _titleColor = _CONFIG.titleColor;

      var div_root = document.createElement('div');
      div_root.id = 'stalk';
      div_root.className = isEmbeded ? 'stalk_status_expanded' : 'stalk_status_compressed';

      div_root.innerHTML =
        '  <div id="stalk_window" style="margin: ' + (isEmbeded ? '0px 0px' : '0px 20px') + (_fontFamily ? '; font-family: ' + _fontFamily : '') + '; bottom: 0px; right: 0px; display: none; position: ' + (isEmbeded ? 'static' : 'fixed') + '; width: ' + _width + '" class="stalk_window_base stalk_window_width stalk_window_fixed_bottom stalk_window_fixed_right "> ' +
        '    <div id="stalk_panel" class="stalk_panel_border stalk_panel_bg" style="display: block;"> ' +
        '' +
        '     <div id="stalk_title" style="display: block;"> ' +
        '        <div id="stalk_topbar" class="stalk_panel_title_fg stalk_panel_title_bg" style="text-align: center; ' + (_titleColor ? 'background-color: ' + _titleColor + '!important;' : '') + ' "> ' +
        '          <a id="stalk_sizebutton" class="stalk_button">^</a> ' +
        '          <a id="stalk_logoutbutton" class="stalk_button" style="display: none">X</a> ' +
        '          <a id="stalk_oplink" class="stalk_panel_title_fg" > . . . . </a> ' +
        '        </div> ' +
        '      </div> ' +
        '' +
        '      <div id="stalk_contents" style="display: ' + (isEmbeded ? 'block' : 'none') + ';"> ' +
        '        <div id="stalk_body"> ' +
        '' +
        '          <div id="stalk_conversation" class="stalk_conversation stalk_panel_bg" style="height: ' + _height + '; display: block;"></div>' +

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
        '        <div id="stalk_footer" style="text-transform: uppercase; font-size: 9px; letter-spacing: 2px; font-weight: bold; padding: 6px 0px !important; font-family: helvetica, sans-serif !important; text-align: center !important; color: rgb(131, 136, 135) !important; clear: both;"> ' +
        '          <a style="font-family: helvetica, sans-serif !important; text-transform: uppercase; font-size: 9px !important; letter-spacing: 2px; font-weight: bold; color: #c9362f !important; text-decoration: none; text-align:center !important;" ' +
        '          href="http://stalk.io" target="_blank">stalk.io</a> ' +
        '          <a href="" id="stalk_mylink" target="_blank">       ' +
        '          <img id="stalk_myimage" />                        ' +
        '          </a>                        ' +
        '        </div> ' +
        '      </div> ' +
        '' +
        '    </div> ' +
        '    <div style="display: none;"></div> ' +
        '  </div> ';

      var _root = isEmbeded ? document.getElementById(_CONFIG.div) : document.getElementsByTagName('body')[0];
      _root.appendChild(div_root);

      var self = this;
      var div_titlebar = document.getElementById('stalk_title');
      var div_contents = document.getElementById('stalk_contents');
      var el_textarea = document.getElementById('stalk_input_textarea');
      var div_logout = document.getElementById('stalk_logoutbutton');

      if (_CONFIG.user.name) {
        self.setTitleBar('login');
      }

      div_logout.onclick = function (event) {

        utils.delUserInfo();
        self.setTitleBar('logout');

        _CONFIG.user = {};

        event.preventDefault();
        event.stopPropagation();

      };

      if (!isEmbeded) {

        document.getElementById('stalk_sizebutton').style.display = 'none';

        div_titlebar.onclick = function () {

          if (div_contents.style.display != 'none') {
            div_contents.style.display = 'none';
            document.getElementById('stalk').className = 'stalk_status_compressed';
          } else {
            self.blinkHeader(true);
            div_contents.style.display = 'block';
            document.getElementById('stalk').className = 'stalk_status_expanded';

            self.focusTextarea();

            var div_message = document.getElementById('stalk_conversation');
            div_message.scrollTop = div_message.scrollHeight;

          }
        };
      }

      el_textarea.onkeydown = function (e) {

        self.blinkHeader(true);

        e = window.event || e;
        var keyCode = (e.which) ? e.which : e.keyCode;

        if (keyCode == 13 && !e.shiftKey) {

          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }

          var message = el_textarea.value;
          message = utils.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

          if (message.length > 0) {

            STALK.sendMessage(encodeURIComponent(message));
            el_textarea.value = '';

          }
        }
      };

    },

    addMessage: function (message, from) {

      var div_message = document.getElementById('stalk_conversation');

      _CONFIG._last_id = from.id;
      _CONFIG._last_count = _CONFIG._last_count + 1;
      var messageId = _CONFIG._last_id + '-' + _CONFIG._last_count;

      var msg = '';
      if (_CONFIG.user && _CONFIG.user.id != from.id) {

        msg = msg + '<span class="stalk_message_from stalk_message_fg ">' +
          '<span class="small_name">' + decodeURIComponent(from.name) + '</span>' +
          '<a href="' + from.url + '" target="_blank"  style="float:left">' +
          '<img src="' + from.image + '" style="width: 30px;" /></a> ' +
          '</span>' +
          '<span id="' + messageId + '" class="messages_from">' + decodeURIComponent(message) + '</span>';

        var chatDiv = document.createElement("p");
        chatDiv.className = 'stalk_message_clearfix';
        chatDiv.innerHTML = msg;

      } else {

        msg += '<span id="' + messageId + '" class="messages_to">' + decodeURIComponent(message) + '</span>';

        var chatDiv = document.createElement("p");
        chatDiv.className = 'stalk_messages_to';
        chatDiv.innerHTML = msg;
        chatDiv.style.textAlign = "right";
      }

      div_message.appendChild(chatDiv);

      div_message.scrollTop = div_message.scrollHeight;

      if (document.getElementById('stalk_contents').style.display != 'block') {
        this.blinkHeader();
      }

    },

    addNotification: function (message) {
      _CONFIG._last_id = '';
      var chatDiv = document.createElement("p");
      chatDiv.className = 'stalk_message';
      chatDiv.innerHTML = '<span class="stalk_message_notification">' + message + '</span>';

      var div_message = document.getElementById('stalk_conversation');
      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

    },

    addSysMessage: function (message) {
      _CONFIG._last_id = '';
      var chatDiv = document.createElement("span");
      chatDiv.className = 'stalk_message_note';
      chatDiv.innerHTML = message;

      var div_message = document.getElementById('stalk_conversation');
      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

    },

    blinkTimeout: '',
    blinkHeader: function (isDone) {
      if (isDone) {
        clearInterval(this.blinkTimeout);
        var titleDivForBlick = document.getElementById('stalk_topbar');
        utils.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
      } else {
        clearInterval(this.blinkTimeout);
        this.blinkTimeout =
          setInterval(function () {
            var titleDivForBlick = document.getElementById('stalk_topbar');
            if (utils.hasClass(titleDivForBlick, 'stalk_panel_title_bg_blink')) {
              utils.removeClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
            } else {
              utils.addClass(titleDivForBlick, 'stalk_panel_title_bg_blink');
            }
          }, 1000);
      }
    },

    focusTextarea: function () {


      if (utils.isIE()) {
        setTimeout(function () {
          if (document.getElementById('stalk_chatform').style.display == 'block') {
            document.getElementById('stalk_input_textarea').focus();
          }
        }, 1000);
      } else {
        var el_textarea = document.getElementById('stalk_input_textarea');
        el_textarea.focus();
      }

    },

    setTitleBar: function (_event, data) {

      if (_event == 'login') {
        document.getElementById('stalk_logoutbutton').style.display = 'block';
        document.getElementById('stalk_chatform').style.display = 'block';
        document.getElementById('stalk_loginform').style.display = 'none';
        document.getElementById('stalk_myimage').style.display = 'block';

        document.getElementById('stalk_myimage').src = _CONFIG.user.image;
        document.getElementById('stalk_mylink').href = _CONFIG.user.url;

        this.focusTextarea();

      } else if (_event == 'logout') {
        document.getElementById('stalk_logoutbutton').style.display = 'none';
        document.getElementById('stalk_chatform').style.display = 'none';
        document.getElementById('stalk_loginform').style.display = 'block';
        document.getElementById('stalk_myimage').style.display = 'none';
        this.addNotification('Logout completely. Try logging on again.');

      } else if (_event == 'title') {
        document.getElementById('stalk_oplink').innerHTML = String(_CONFIG.message.title).replace(/{title}/g, data);

      }

    }

  };

  // 4. Event Handler


  /************************************************************/

  if (_CONFIG.isReady) return false;

  var STALK;
  if (typeof exports !== 'undefined') {
    STALK = exports;
  } else {
    STALK = root.STALK = {};
  }

  if (root.stalkConfig) {
    _CONFIG = utils.mergeConfig(_CONFIG, root.stalkConfig);
  }

  if (!_CONFIG.channel) _CONFIG.channel = encodeURIComponent(location.hostname + location.pathname);

  utils.loadCss(_CONFIG.css_url);
  utils.loadJson(_CONFIG.server_url + '/node/' + encodeURIComponent(_CONFIG.app_id) + '/' + encodeURIComponent(_CONFIG.channel) + '?1=1', 'STALK._callbackInit');

  STALK.getVersion = function () {
    return version;
  };

  STALK._callbackInit = function (data) {

    if (
      _CONFIG.isReady ||
      data.status != 'ok' || !data.result.server
    ) return false;

    var _user = utils.getUserInfo();
    if (_user.name) {
      _CONFIG.user = _user;
    } else {
      _CONFIG.user = {};
    }

    if (!_CONFIG.user.id) _CONFIG.user['id'] = utils.getUniqueKey();

    var query =
      'A=' + _CONFIG.app_id + '&' +
      'U=' + _CONFIG.user.id + '&' +
      'D=' + '_' + '&' +
      'C=' + _CONFIG.channel + '&' +
        //'DT=' + JSON.stringify(_CONFIG.user) + '&' +
      'S=' + data.result.server.name;

    _CONFIG._socket = io.connect(data.result.server.url + '/channel?' + query);

    _CONFIG._socket.on('connect', function () {

      if (!_CONFIG._isCreate) {

        layout.initWin();

        var initMessage = _CONFIG.message.welcome;
        if (!_CONFIG.user.name) {
          initMessage = initMessage + 'Try logging on for chatting.';
        }
        layout.addSysMessage(initMessage);
      }
      _CONFIG._isCreate = true;

    });

    _CONFIG._socket.on('_event', function (data) {
      if (data.event == 'CONNECTION') {
        layout.setTitleBar('title', data.count);
      } else if (data.event == 'DISCONNECT') {
        layout.setTitleBar('title', data.count);
      }
    });

    _CONFIG._socket.on('message', function (data) {
      layout.addMessage(data.message, data.user);
    });

  };

  STALK.sendMessage = function (msg) {
    var param = {
      A: _CONFIG.app_id,
      C: _CONFIG.channel,
      NM: 'message',
      DT: {
        user: _CONFIG.user,
        message: msg
      }
    };
    _CONFIG._socket.emit('send', param, function (data) {
    });
  };


}(this));