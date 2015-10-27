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

  var divLauncher = document.getElementById('stalk-launcher');
  var btnLauncher = document.getElementById('stalk-launcher-button');
  var divChatbox = document.getElementById('stalk-chatbox');

  var txMessage = document.getElementById('txMessage');

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
    addUserMessage: function (message) {

      var div_message = document.getElementById('stalk-message');

      var msgHtml = '<div class="stalk-comment stalk-comment-by-user"> <div class="stalk-comment-body-container"> <div class="stalk-comment-body stalk-embed-body"> <p>' +
        message + '</p> </div> <div class="stalk-comment-caret"></div> </div> </div>';

      var chatDiv = document.createElement("div");
      chatDiv.className = 'stalk-conversation-part stalk-conversation-part-grouped-first';
      chatDiv.innerHTML = msgHtml;

      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

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
        layout.addUserMessage(message);
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

  if (!_CONFIG.channel) _CONFIG.channel = encodeURIComponent(location.hostname + location.pathname);

  //utils.loadCss(_CONFIG.css_url); // @ TODO 이거 처리 어떻게 할 것인지 확인 필요 !!
  utils.loadJson(_CONFIG.server_url + '/node/' + encodeURIComponent(_CONFIG.app_id) + '/' + encodeURIComponent(_CONFIG.channel) + '?1=1', 'STALK._callbackInit');

  STALK.getVersion = function () {
    return version;
  };

  STALK._callbackInit = function (data) {

  };

}(this));