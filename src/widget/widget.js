(function (global) {

  var root = global;

  // 1. private variable (using this scope)
  var version = '1.0';
  var _CONFIG = {
    user: 'guest',
    admin: undefined,
    div: undefined,
    app_id: undefined,
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

  var _STATUS = {
    last: '',
    current: '',
    timestamp: {
      admin: 0,
      user: 0
    }
  };

  var divLauncher = document.getElementById('stalk-launcher');
  var btnLauncher = document.getElementById('stalk-launcher-button');
  var divChatbox = document.getElementById('stalk-chatbox');

  var txMessage = document.getElementById('txMessage');

  var utils = {
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
    },
    initXMLhttp: function () {
      var xmlhttp;
      if (window.XMLHttpRequest) {
        //code for IE7,firefox chrome and above
        xmlhttp = new XMLHttpRequest();
      } else {
        //code for Internet Explorer
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      return xmlhttp;
    },
    minAjax: function (config) {

      if (!config.url) {
        if (config.debugLog == true)
          console.log("No Url!");
        return;
      }

      if (!config.type) {
        if (config.debugLog == true)
          console.log("No Default type (GET/POST) given!");
        return;
      }

      if (!config.method) {
        config.method = true;
      }

      if (!config.debugLog) {
        config.debugLog = false;
      }

      var xmlhttp = this.initXMLhttp();

      xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

          if (config.success) {
            config.success(xmlhttp.responseText, xmlhttp.readyState);
          }

          if (config.debugLog == true)
            console.log("SuccessResponse");
          if (config.debugLog == true)
            console.log("Response Data:" + xmlhttp.responseText);

        } else {

          if (config.debugLog == true)
            console.log("FailureResponse --> State:" + xmlhttp.readyState + "Status:" + xmlhttp.status);
        }
      };

      var sendString = [],
        sendData = config.data;
      if (typeof sendData === "string") {
        var tmpArr = String.prototype.split.call(sendData, '&');
        for (var i = 0, j = tmpArr.length; i < j; i++) {
          var datum = tmpArr[i].split('=');
          sendString.push(encodeURIComponent(datum[0]) + "=" + encodeURIComponent(datum[1]));
        }
      } else if (typeof sendData === 'object' && !( sendData instanceof String || (FormData && sendData instanceof FormData) )) {
        for (var k in sendData) {
          var datum = sendData[k];
          if (Object.prototype.toString.call(datum) == "[object Array]") {
            for (var i = 0, j = datum.length; i < j; i++) {
              sendString.push(encodeURIComponent(k) + "[]=" + encodeURIComponent(datum[i]));
            }
          } else {
            sendString.push(encodeURIComponent(k) + "=" + encodeURIComponent(datum));
          }
        }
      }
      sendString = sendString.join('&');

      if (config.type == "GET") {
        xmlhttp.open("GET", config.url + "?" + sendString, config.method);
        xmlhttp.send();

        if (config.debugLog == true)
          console.log("GET fired at:" + config.url + "?" + sendString);
      }
      if (config.type == "POST") {
        xmlhttp.open("POST", config.url, config.method);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(sendString);

        if (config.debugLog == true)
          console.log("POST fired at:" + config.url + " || Data:" + sendString);
      }
    },
    requestAdminInfo: function (_callback) {

      if(!_CONFIG.server_url || !_CONFIG.app_id){
        console.error('error on initiation.'); // @ TODO console logging !
        return false;
      }

      this.minAjax({
        url: _CONFIG.server_url + '/user/list/active',
        type: "POST",
        data: {
          A: _CONFIG.app_id
        },
        //method: "true",
        //debugLog: "true",
        success: _callback
      });
    },
    requestServerInfo: function (_callback) {

      if(!_CONFIG.server_url || !_CONFIG.app_id || !_CONFIG.channel){
        console.error('error on initiation.'); // @ TODO console logging !
        return false;
      }

      this.minAjax({
        url: _CONFIG.server_url + '/node/' + encodeURIComponent(_CONFIG.app_id) + '/' + encodeURIComponent(_CONFIG.channel),
        type: "GET",
        success: _callback
      });
    }

  };

  var layout = {
    open: function () {
      utils.removeClass(divLauncher, 'stalk-launcher-active');
      utils.addClass(divLauncher, 'stalk-launcher-inactive');
      divChatbox.style.display = 'block';
    },
    close: function () {
      utils.removeClass(divLauncher, 'stalk-launcher-inactive');
      utils.addClass(divLauncher, 'stalk-launcher-active');
      divChatbox.style.display = 'none';
    },
    addMessage: function (message, admin) {

      console.log(admin);

      var div_message = document.getElementById('stalk-message');


      _STATUS.current = 'admin';
      if (!admin) {
        _STATUS.current = 'user';
      }

      var classStr = 'stalk-conversation-part stalk-conversation-part-grouped';
      if (_STATUS.last != _STATUS.current) {
        classStr = classStr + '-first';
      }

      var msgHtml = '<div class="stalk-comment stalk-comment-by-' + _STATUS.current + '"> <div class="stalk-comment-body-container"> <div class="stalk-comment-body stalk-embed-body"> <p>' +
        message + '</p> </div> <div class="stalk-comment-caret"></div> </div> </div>';

      var chatDiv = document.createElement("div");
      chatDiv.className = classStr;
      chatDiv.innerHTML = msgHtml;

      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

      _STATUS.last = _STATUS.current;

    }
  };

  // element event handlers
  btnLauncher.onclick = function (e) {
    layout.open();
  };

  document.getElementById('btnClose').onclick = function (e) {
    layout.close();
  };

  txMessage.onkeydown = function (e) {

    e = root.event || e;
    var keyCode = (e.which) ? e.which : e.keyCode;

    if (keyCode == 13 && !e.shiftKey) {

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

      var message = txMessage.value.toString().trim();
      message = utils.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

      if (message !== "") {

        STALK.sendMessage(message);

        layout.addMessage(message);
        txMessage.value = "";
      }

      return false;
    }
  };


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
  _CONFIG.app_id = 'STALK:' + _CONFIG.app_id; // append prefix ('STALK')

  if (!_CONFIG.channel) _CONFIG.channel = encodeURIComponent(/*location.hostname + */ location.pathname);

  STALK._start = function () {

    /* TODO : Loading CSS  */ //utils.loadCss(_CONFIG.css_url);

    utils.requestAdminInfo(function (data) {
      data = JSON.parse(data);
      if (data.status == 'ok' && data.result.length > 0) {

        _CONFIG.admin = data.result[0].U; // @ TODO U is not user real name (just user id)

        utils.requestServerInfo(STALK._callbackInit);
      }
    });

  };

  STALK._callbackInit = function (data) {

    data = JSON.parse(data);

    console.log(data);
    console.log(data.status);
    console.log(data.status != 'ok');
    console.log(!data.result.server);
    console.log(_CONFIG.isReady);
    if (
      _CONFIG.isReady ||
      data.status != 'ok' || !data.result.server
    ) return false;

    var query =
      'A=' + _CONFIG.app_id + '&' +
      'U=' + _CONFIG.user + '&' +
      'D=' + '_' + '&' +
      'C=' + _CONFIG.channel + '&' +
        //'DT=' + JSON.stringify(_CONFIG.user) + '&' +
      'S=' + data.result.server.name;

    _CONFIG._socket = io.connect(data.result.server.url + '/channel?' + query);

    _CONFIG._socket.on('connect', function () {

      console.log('CONNECTION');

      if (!_CONFIG._isCreate) {

        // TODO 나중에 개발해야 함
        //layout.initWin();

        var initMessage = _CONFIG.message.welcome;
        // TODO welcome 메시지 보여줄 것.
      }
      _CONFIG._isCreate = true;
      _CONFIG.isReady = true;

    });

    _CONFIG._socket.on('_event', function (data) {
      if (data.event == 'CONNECTION') {
        //layout.setTitleBar('title', data.count);
      } else if (data.event == 'DISCONNECT') {
        //layout.setTitleBar('title', data.count);
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

  STALK.getVersion = function () {
    return version;
  };


  STALK._start();

}(this));