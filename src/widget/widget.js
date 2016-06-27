(function (global) {

  if (!window.console) console = {
    log: function () {
    },
    error: function () {
    }
  };

  var TEMPLATE = '<div id="stalk-container" class="stalk-container stalk-reset stalk-acquire"> <div id="stalk-launcher" class="stalk-launcher stalk-launcher-enabled stalk-launcher-active"> <div id="stalk-launcher-button" class="stalk-launcher-button"></div></div><div id="stalk-chatbox" class="stalk-chatbox" style="display: none;"> <div id="stalk-conversation" class="stalk-conversation stalk-sheet stalk-sheet-active"> <div class="stalk-sheet-header"> <div class="stalk-sheet-header-title-container"> <b class="stalk-sheet-header-title stalk-sheet-header-with-presence"></b> <div class="stalk-last-active" style="display: block;"><span class="relative-time-in-text"></span> </div></div><div class="stalk-sheet-header-generic-title"></div><a id="btnExpandMore" class="stalk-sheet-header-button stalk-sheet-header-expand-more-button" href="javascript:;"><div class="stalk-sheet-header-button-icon"></div></a><a id="btnExpandLess" class="stalk-sheet-header-button stalk-sheet-header-expand-less-button" href="javascript:;" style="display:none;"><div class="stalk-sheet-header-button-icon"></div></a><a id="btnClose" class="stalk-sheet-header-button stalk-sheet-header-close-button" href="javascript:;"> <div class="stalk-sheet-header-button-icon"></div></a></div><div id="expandMenu" class="stalk-expand-menu"><label class="stalk-label-container"><div class="stalk-form-field-container"><span class="stalk-form-field-label">Name</span><span class="stalk-form-field"><input value="" type="text" name="nickname" id="nickname"><img src="http://static.stalk.io/images/ic_success.png" id="btnApply" class="button-icon" alt="apply"/></span></div></label><label class="stalk-label-container"><div class="stalk-form-field-container"><span class="stalk-form-field-label">Image Url</span><span class="stalk-form-field"><input value="" type="text" name="profileUrl" id="profileUrl" style="width:160px"></span></div></label></div><div class="stalk-sheet-body"></div><div class="stalk-sheet-content" style="bottom: 74px;"> <div class="stalk-sheet-content-container"> <div class="stalk-conversation-parts-container"> <div id="stalk-message" class="stalk-conversation-parts"> </div></div></div></div><div class="stalk-composer-container"> <div id="stalk-composer" class="stalk-composer" style="transform: translate(0px, 0px);"> <div class="stalk-composer-textarea-container"> <div class="stalk-composer-textarea stalk-composer-focused"><strong class="stalk-composer-action-button stalk-composer-upload-button" title="Send attachment" id="attachment" style="display: inline;"></strong> <pre><span></span><br></pre> <textarea id="txMessage" placeholder="Write a reply…"></textarea><img src="https://raw.githubusercontent.com/xpush/io.stalk.admin/master/client/assets/images/face.png" id="floating-image" class="floating-image"></div></div></div></div></div></div><div id="stalk-image-viewer" class="stalk-image-viewer" style="display:none;"><div class="stalk-image-viewer-overlay" style="opacity: 0.8;"></div><img id="stalk-zoomed-image" class="stalk-zoomed-image" style="transform: translate(0px, 0px) scale(1, 1);top:0px;"></div></div><input type="file" id="file" style="display:none"/>';

  var MAIL_TEMPLATE = '<div id="stalk-container" class="stalk-container"><div id="stalk-launcher" class="stalk-launcher stalk-launcher-enabled stalk-launcher-active"><div id="stalk-launcher-button" class="stalk-launcher-button"></div></div><div id="stalk-offline-container" style="display:none;"><div id="div-form-container" class="stalk-form-container"><div class="stalk-form-container-header ui-paddingHL"><header><h2>After hours Support : Leave a message</h2></header><a id="btnClose" class="stalk-form-container-header-close-button" href="#"><div class="button-icon"></div></a></div><div id="form-container-content" class="stalk-form-container-content ui-paddingLL ui-marginRS ui-paddingRS ui-paddingTM is-expanded" ><div ><label class="stalk-label-container" ><div class="stalk-form-field-container " ><span >Your name</span><span ></span></div><div class="stalk-form-field " ><input value="" type="text" name="name" id="name"></div></label><label class="stalk-label-container" ><div class="stalk-form-field-container " ><span >Your Email address</span><span >*</span></div><div class="stalk-form-field " ><input value="" type="text" name="email" type="email" id="email"><p id="email-help" class="help-block">What\'s your email address?</p></div></label><label class="stalk-label-container" ><div class="stalk-form-field-container " ><span >How can we help you?</span><span >*</span></div><div class="stalk-form-field " ><textarea rows="5" name="message" id="message"></textarea><p id="message-help" class="help-block">Message must be at least 3 characters.</p></div></label><p class="Error ui-marginTL ui-isHidden" ></p></div></div><div id="stalk-result" class="ui-paddingLL ui-marginRS stalk-result" style="display:none;"><img src="http://static.stalk.io/images/ic_success.png" class="stalk-result-image"><div class="stalk-result-message">Message Sent</div></div><footer class="stalk-form-container-footer ui-paddingHL ui-paddingVM" ><div class="stalk-button-group" ><div id="btnCancel" class="btn btn-secondary" >Cancel</div><input id="btnMailSend" type="submit" value="Send" class="btn btn-primary ui-textNoWrap ui-borderTransparent ui-userBackgroundColor" ><div id="btnOk" class="btn btn-success" style="display:none;">OK</div></div></footer></div></div>';
  var root = global;

  // 1. private variable (using this scope)

  var version = '1.0';

  var _CONFIG = {
    id: undefined,
    app: 'STALK',
    user: 'guest',
    admin: undefined,
    div: undefined,
    api_server: undefined,
    css_url: 'http://static.stalk.io/widget.css',
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
      // enter: undefined,  // enter the site
      // admin: undefined,  // first message from admin
      // user: undefined   // first message to admin
    }, lastTimestamp: {
      // admin: undefined
    }
  };

  var utils = {
    lpad: function(s, padLength, padString) {
      while (s.length < padLength)
        s = padString + s;
      return s;
    },
    getUniqueKey: function() {
      var s = [],
        itoh = '0123456789ABCDEF';
      for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
      s[14] = 4;
      s[19] = (s[19] & 0x3) | 0x8;

      for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
      s[8] = s[13] = s[18] = s[23] = '-';

      return s.join('');
    },
    getTempUser: function() {
      var rd = Math.floor((Math.random() * 1000) + 1);
      return 'guest' + this.lpad(new String(rd), 4, 0);
    },
    getEscapeHtml: function(html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    getHashCode: function(s) {
      var hash = 0;
      if (s.length === 0) return hash;
      for (var i = 0; i < s.length; i++) {
        var char1 = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char1;
        hash = hash & hash;
      }
      return hash;
    },
    loadScript: function(url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) { //IE
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" ||
            script.readyState == "complete") {
            callback();
          }
        };
      } else { //Others
        script.onload = function() {
          callback();
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    loadCss: function(url) {
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
      return link;
    },
    loadJson: function(url, callbackStr) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.id = this.getHashCode(url);
      if (script.readyState) { //IE
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" ||
            script.readyState == "complete") {}
        };
      } else {
        script.onload = function() {
          // DO Something?
        };
      }
      script.src = url + '&callback=' + callbackStr + '&_noCacheIE=' + (new Date()).getTime();
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    hasClass: function(el, val) {
      var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
      return pattern.test(el.className);
    },
    addClass: function(ele, cls) {
      if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    },
    removeClass: function(ele, cls) {
      if (this.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
      }
    },
    isIE: function() {
      return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    },
    mergeConfig: function(obj1, obj2) {

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
    initXMLhttp: function() {
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
    minAjax: function(config) {

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

      xmlhttp.onreadystatechange = function() {

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
      } else if (typeof sendData === 'object' && !(sendData instanceof String || (FormData && sendData instanceof FormData))) {
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
      if (config.type == "POST" || config.type == "PUT") {
        xmlhttp.open(config.type, config.url, config.method);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(sendString);

        if (config.debugLog == true)
          console.log("POST fired at:" + config.url + " || Data:" + sendString);
      }
    },
    requestAdminInfo: function(_callback) {

      if (!_CONFIG.server || !_CONFIG.id) {
        console.error('error on initiation.'); // @ TODO console logging !
        return false;
      }

      var logData = {
        A: _CONFIG.id,
        ENS: _STATUS.timestamp.enter,
        VID: _STATUS.shortid,
        BR: utils.getBrowserName(),
        U: location.href,
        REF: utils.getReferrerSite(),
        CH: _CONFIG.channel
      };

      this.minAjax({
        url: _CONFIG.server + '/api/apps/operators/' + _CONFIG.id,
        type: "POST",
        data: logData,
        success: _callback
      });
    },
    requestServerInfo: function(_callback) {

      if (!_CONFIG.api_server || !_CONFIG.id || !_CONFIG.channel) {
        console.error('error on initiation.'); // @ TODO console logging !
        return false;
      }

      this.minAjax({
        url: _CONFIG.api_server + '/node/' + encodeURIComponent(_CONFIG.id) + '/' + encodeURIComponent(_CONFIG.channel),
        type: "GET",
        success: _callback
      });
    },
    getCookie: function(c_name) {
      var i, x, y, ARRcookies = document.cookie.split(";");
      for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
          return unescape(y);
        }
      }
    },
    setCookie: function(c_name, value, exdays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
      document.cookie = c_name + "=" + c_value;
    },
    getUserAgent: function() {
      return navigator.userAgent.toLowerCase();
    },
    getBrowserName: function() {
      var BrowserKey = {
        ie: "msie",
        ie6: "msie 6",
        ie7: "msie 7",
        ie8: "msie 8",
        ie9: "msie 9",
        ie10: "msie 10",
        chrome: "chrome",
        safari: "safari",
        safari3: "applewebkir/5",
        mac: "mac",
        firefox: "firefox"
      };
      var ua = this.getUserAgent();
      var re = /\S*\/[\d.]*/g;
      var m;

      while ((m = re.exec(ua)) != null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        for (var k in BrowserKey) {
          if (m[0].indexOf(BrowserKey[k]) != -1) return k;
        }
      }
    },
    getOSName: function() {

      var uanaVigatorOs = navigator.userAgent;
      var AgentUserOs = uanaVigatorOs.replace(/ /g, '');
      var Ostxt = "";
      var OSName = "";
      var OsVers = "";
      new function() {
        var OsNo = navigator.userAgent.toLowerCase();
        jQuery = {};
        jQuery.os = {
          Linux: /linux/.test(OsNo),
          Unix: /x11/.test(OsNo),
          Mac: /mac/.test(OsNo),
          Windows: /win/.test(OsNo)
        };
      };
      // Android의 단말 이름을 반환
      function getAndroidDevName() {
        var uaAdata = navigator.userAgent;
        var regex = /Android (.*);.*;\s*(.*)\sBuild/;
        var match = regex.exec(uaAdata);
        if (match) {
          var ver = match[1];
          var dev_name = match[2];
          return "Android " + ver + " " + dev_name;
        }
        return "Android OS";
      }

      if (jQuery.os.Windows) {
        if (AgentUserOs.indexOf("WindowsCE") != -1) OSName = "Windows CE";
        else if (AgentUserOs.indexOf("Windows95") != -1) OSName = "Windows 95";
        else if (AgentUserOs.indexOf("Windows98") != -1) {
          if (AgentUserOs.indexOf("Win9x4.90") != -1) OSName = "Windows Millennium Edition (Windows Me)";
          else OSName = "Windows 98";
        } else if (AgentUserOs.indexOf("WindowsNT4.0") != -1) OSName = "Microsoft Windows NT 4.0";
        else if (AgentUserOs.indexOf("WindowsNT5.0") != -1) OSName = "Windows 2000";
        else if (AgentUserOs.indexOf("WindowsNT5.01") != -1) OSName = "Windows 2000, Service Pack 1 (SP1)";
        else if (AgentUserOs.indexOf("WindowsNT5.1") != -1) OSName = "Windows XP";
        else if (AgentUserOs.indexOf("WindowsNT5.2") != -1) OSName = "Windows 2003";
        else if (AgentUserOs.indexOf("WindowsNT6.0") != -1) OSName = "Windows Vista/Server 2008";
        else if (AgentUserOs.indexOf("WindowsNT6.1") != -1) OSName = "Windows 7";
        else if (AgentUserOs.indexOf("WindowsNT6.2") != -1) OSName = "Windows 8";
        else if (AgentUserOs.indexOf("WindowsNT6.3") != -1) OSName = "Windows 8.1";
        else if (AgentUserOs.indexOf("WindowsPhone8.0") != -1) OSName = "Windows Phone 8.0";
        else if (AgentUserOs.indexOf("WindowsPhoneOS7.5") != -1) OSName = "Windows Phone OS 7.5";
        else if (AgentUserOs.indexOf("Xbox") != -1) OSName = "Xbox 360";
        else if (AgentUserOs.indexOf("XboxOne") != -1) OSName = "Xbox One";
        else if (AgentUserOs.indexOf("Win16") != -1) OSName = "Windows 3.x";
        else if (AgentUserOs.indexOf("ARM") != -1) OSName = "Windows RT";
        else OSName = "Windows (Unknown)";

        if (AgentUserOs.indexOf("WOW64") != -1) OsVers = " 64-bit(s/w 32-bit)";
        else if (AgentUserOs.indexOf("Win64;x64;") != -1) OsVers = " 64-bit(s/w 64-bit)";
        else if (AgentUserOs.indexOf("Win16") != -1) OsVers = " 16-bit";
        else OsVers = " 32-bit";

      } else if (jQuery.os.Linux) {
        if (AgentUserOs.indexOf("Android") != -1) {
          OSName = getAndroidDevName();
        } else if (AgentUserOs.indexOf("BlackBerry9000") != -1) OSName = "BlackBerry9000";
        else if (AgentUserOs.indexOf("BlackBerry9300") != -1) OSName = "BlackBerry9300";
        else if (AgentUserOs.indexOf("BlackBerry9700") != -1) OSName = "BlackBerry9700";
        else if (AgentUserOs.indexOf("BlackBerry9780") != -1) OSName = "BlackBerry9780";
        else if (AgentUserOs.indexOf("BlackBerry9900") != -1) OSName = "BlackBerry9900";
        else if (AgentUserOs.indexOf("BlackBerry;Opera Mini") != -1) OSName = "Opera/9.80";
        else if (AgentUserOs.indexOf("Symbian/3") != -1) OSName = "Symbian OS3";
        else if (AgentUserOs.indexOf("SymbianOS/6") != -1) OSName = "Symbian OS6";
        else if (AgentUserOs.indexOf("SymbianOS/9") != -1) OSName = "Symbian OS9";
        else if (AgentUserOs.indexOf("Ubuntu") != -1) OSName = "Ubuntu";
        else if (AgentUserOs.indexOf("PDA") != -1) OSName = "PDA";
        else if (AgentUserOs.indexOf("NintendoWii") != -1) OSName = "Nintendo Wii";
        else if (AgentUserOs.indexOf("PSP") != -1) OSName = "PlayStation Portable";
        else if (AgentUserOs.indexOf("PS2;") != -1) OSName = "PlayStation 2";
        else if (AgentUserOs.indexOf("PLAYSTATION3") != -1) OSName = "PlayStation 3";
        else OSName = "Linux (Unknown)";

        if (AgentUserOs.indexOf("x86_64") != -1) OsVers = " 64-bit";
        else if (AgentUserOs.indexOf("i386") != -1) OsVers = " 32-bit";
        else if (AgentUserOs.indexOf("IA-32") != -1) OsVers = " 32-bit";
        else OsVers = "";

      } else if (jQuery.os.Unix) {
        OSName = "UNIX";
      } else if (jQuery.os.Mac) {
        if (AgentUserOs.indexOf("iPhoneOS3") != -1) OSName = "iPhone OS 3";
        else if (AgentUserOs.indexOf("iPhoneOS4") != -1) OSName = "iPhone OS 4";
        else if (AgentUserOs.indexOf("iPhoneOS5") != -1) OSName = "iPhone OS 5";
        else if (AgentUserOs.indexOf("iPhoneOS6") != -1) OSName = "iPhone OS 6";
        else if (AgentUserOs.indexOf("iPad") != -1) OSName = "iPad";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.1")) != -1) OSName = "Mac OS X Puma";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.2")) != -1) OSName = "Mac OS X Jaguar";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.3")) != -1) OSName = "Mac OS X Panther";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.4")) != -1) OSName = "Mac OS X Tiger";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.5")) != -1) OSName = "Mac OS X Leopard";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.6")) != -1) OSName = "Mac OS X Snow Leopard";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.7")) != -1) OSName = "Mac OS X Lion";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.8")) != -1) OSName = "Mac OS X Mountain Lion";
        else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.9")) != -1) OSName = "Mac OS X Mavericks";
        else OSName = "MacOS (Unknown)";
      } else {
        OSName = "Unknown OS";
      }
      var OSDev = OSName + OsVers;
      return OSDev;
    },
    getReferrerSite: function() { // if referrer site is other site, then return value is url. but undefined.
      var _referrer = document.referrer || '';
      var otherSite;
      if (_referrer.indexOf(location.host) < 0) {
        otherSite = _referrer;
      }
      return otherSite;
    },
    onChangeUrl: function(cb) {
      window.addEventListener('hashchange', function(e) {
        var data = {
          oldURL: e.oldURL,
          newURL: e.newURL
        };
        //sendClientInfo('urlChange', data);
        if (cb) cb();
      });
    },
    getUserStayTime: function() {
      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      var ms = (new Date()) - (new Date(_STATUS.timestamp.user));
      var seconds = ms / 1000;
      var hh = Math.floor(seconds / 3600);
      var mm = Math.floor(seconds / 60) % 60;
      var ss = Math.floor(seconds) % 60;
      var mss = ms % 1000;
      return pad(hh, 2) + ':' + pad(mm, 2) + ':' + pad(ss, 2) + '.' + pad(mss, 3);
    },
    onLeaveSite: function(cb) {
      var self = this;
      var data = {
        url: location.href
      };
      data.st = this.getUserStayTime();
      window.addEventListener('beforeunload', function() {
        var logData = {
          OP: _CONFIG.admin.uid,
          VID: _STATUS.shortid,
          CH: _CONFIG.channel,
          LTS: utils.currentDateStr(),
          SMT: _STATUS.timestamp.user,
          RMT: _STATUS.timestamp.admin,
          IP: utils.getClientIp(),
          CT: _STATUS.city,
          CC: _STATUS.country,
          LAT: _STATUS.lat,
          LNG: _STATUS.lng
        };

        self.minAjax({
          url: _CONFIG.server + '/api/activitys',
          type: "PUT",
          data: logData,
          success: function() {

          }
        });
        if (cb) cb();
        // App, url, enterSiteTime, leaveSiteTime, startChatTime, firstResponseTime, 

        //LSTALK.sendClientInfoAjax({a:'L',st: data.st}); 
        //LSTALK.sendClientInfo('leavePage', data);
      });
    },
    getGeo: function() {
      this.minAjax({
        url: _CONFIG.server + '/api/auths/geo/' + utils.getClientIp(),
        type: "GET",
        success: function(data) {
          data = JSON.parse(data);
          _STATUS.country = data.country;
          _STATUS.city = data.city;
          _STATUS.lat = data.lat;
          _STATUS.lng = data.lon;
        }
      });

    },
    browserInfo: function() {
      var info = {};
      info.title = document.title;
      info.url = location.href;
      info.agent = utils.getUserAgent();
      info.browser = utils.getBrowserName();
      info.os = utils.getOSName();
      info.refer = utils.getReferrerSite();
      info.ip = utils.getClientIp();
      info.city = _STATUS.city;
      info.country = _STATUS.country;
      info.lat = _STATUS.lat;
      info.lng = _STATUS.lon;
      info.origin = document.origin;
      info.name = _CONFIG.userName;
      return info;
    },
    setClientIp: function(ip) {
      var self = this;
      self.ip = ip;
    },
    getClientIp: function() {
      var self = this;
      return self.ip;
    },
    isMobile: function() {
      var isMobile = (/iphone|ipod|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
      return isMobile;
    },
    scrollTo: function(element, to, duration) {
      /*
      to = -(to - element.clientHeight);
      to = to > 0 ? 0 : to;
      element.style.webkitTransform = "translateY("+to+"px)";
      element.style.webkitTransform = "translateY("+to+"px)";
      element.style.MozTransform = "translateY("+to+"px)";
      element.style.msTransform = "translateY("+to+"px)";
      element.style.OTransform = "translateY("+to+"px)";
      element.style.transform = "translateY("+to+"px)";
      return;
      */
      var self = this;
      var start = element.scrollTop,
        change = to - start,
        increment = 20;

      var animateScroll = function(elapsedTime) {
        elapsedTime += increment;
        var position = self.easeInOut(elapsedTime, start, change, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
          setTimeout(function() {
            animateScroll(elapsedTime);
          }, increment);
        }
      };

      animateScroll(0);
    },
    currentDateStr: function() {
      return (new Date()).toISOString().substring(0, 19);
    },
    easeInOut: function(currentTime, start, change, duration) {
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    },
    secondsTohhmmss: function(totalSeconds) {
      return (new Date(totalSeconds)).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    },
    timeSince: function(date) {
      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    },
    watchLastResponseTime: function(dom, timestamp) {
      var self = this;
      dom.innerHTML = "Last Response: 0 minitues ago";
      if (_STATUS.watchTime) {
        clearInterval(_STATUS.watchTime);
        _STATUS.watchTime = undefined;
      }
      _STATUS.watchTime = setInterval(function() {
        dom.innerHTML = "Last Response: " + self.timeSince(timestamp) + " ago";
      }, 1000 * 60 * 1);
    },
    generateShortId: function() {
      return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    },

    validateURL: function(textval) {
      var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      return urlregex.test(textval) || urlregex.test(decodeURIComponent(textval));
    }
  };

  var _Elements = {};
  var _TempImages = {};

  var layout = {
    initWin: function() {

      var self = this;

      utils.requestAdminInfo(function(data) {
        data = JSON.parse(data);
        utils.setClientIp(data.clientIp);

        utils.loadCss(_CONFIG.css_url);

        var div_root = document.createElement('div');
        div_root.id = 'stalk';

        if (data.operator) {
          div_root.innerHTML = TEMPLATE;
          if (data.server) _CONFIG.api_server = data.server;
          if (data.app) _CONFIG.app = data.app;

          var _root = document.getElementsByTagName('body')[0];
          _root.appendChild(div_root);

          _Elements['divLauncher'] = document.getElementById('stalk-launcher');
          _Elements['divChatbox'] = document.getElementById('stalk-chatbox');
          _Elements['txMessage'] = document.getElementById('txMessage');

          _CONFIG.admin = data.operator;
          document.querySelector('.stalk-sheet-header-title').innerHTML = _CONFIG.admin.name;
          utils.getGeo();

          // Add Event on elements
          self.initEventHandler();
        } else {

          div_root.innerHTML = MAIL_TEMPLATE;

          var _root = document.getElementsByTagName('body')[0];
          _root.appendChild(div_root);

          _Elements['divLauncher'] = document.getElementById('stalk-launcher');
          _Elements['divChatbox'] = document.getElementById('stalk-offline-container');
          _Elements['txMessage'] = document.getElementById('txMessage');

          self.initEventHandler();
        }
      });

    },
    open: function() {
      utils.removeClass(_Elements.divLauncher, 'stalk-launcher-active');
      utils.addClass(_Elements.divLauncher, 'stalk-launcher-inactive');
      _Elements.divChatbox.style.display = 'block';
      if (document.getElementById('stalk-conversation') != undefined) {
        utils.removeClass(document.getElementById('stalk-conversation'), 'stalk-inactive');
        utils.addClass(document.getElementById('stalk-conversation'), 'stalk-active');
      }
    },
    close: function() {
      utils.removeClass(_Elements.divLauncher, 'stalk-launcher-inactive');
      utils.addClass(_Elements.divLauncher, 'stalk-launcher-active');
      _Elements.divChatbox.style.display = 'none';
      if (document.getElementById('stalk-conversation') != undefined) {
        utils.removeClass(document.getElementById('stalk-conversation'), 'stalk-active');
        utils.addClass(document.getElementById('stalk-conversation'), 'stalk-inactive');
      }
    },


    addMessage: function(message, timestamp, user, type) {

      var div_message = document.getElementById('stalk-message');

      _STATUS.current = 'admin';
      if (user == _CONFIG.user) {
        _STATUS.current = 'user';
      }

      if (_STATUS.current == "admin") {
        utils.watchLastResponseTime(document.querySelector(".stalk-last-active"), timestamp);
        if (!_STATUS.timestamp.admin) _STATUS.timestamp.admin = utils.currentDateStr();
      }

      message = decodeURIComponent(message);

      var msgClass = 'stalk-embed-body';
      var divClass = '';
      var divCaret = '';
      if (type && type == 'IM') {
        msgClass = 'stalk-upload-body';
        divClass = 'stalk-upload-comment stalk-upload-image';
        message = '<img src="' + message + '" onclick="javascript:STALK.viewImage(this);" class="stalk-image-viewable"/>';
      } else if (type && type == 'LN') {
        message = '<p><a href="' + message + '" target="_blank">' + message + '</p>';
        divCaret = '<div class="stalk-comment-caret"></div>';
      } else {
        message = '<p>' + message + '</p>';
        divCaret = '<div class="stalk-comment-caret"></div>';
      }

      var msgHtml = '<div class="stalk-comment-body-container"><div class="stalk-comment-body ' + msgClass + '">';
      msgHtml = msgHtml + message + '</div>' + divCaret + '</div>';

      var msgContainer = document.createElement("div");
      utils.addClass(msgContainer, 'stalk-comment stalk-comment-by-' + _STATUS.current + " " + divClass);
      msgContainer.innerHTML = msgHtml;

      var t = document.querySelector('.stalk-comment-metadata-container');
      if (_STATUS.last != _STATUS.current) {
        if (t) {
          utils.removeClass(t, 'stalk-comment-metadata-container');
          utils.addClass(t, 'stalk-comment-metadata-container-static');
        }
      } else {
        t.parentNode.removeChild(t);
      }

      window.metadata = this.metadata = document.createElement("div");
      utils.addClass(this.metadata, "stalk-comment-metadata-container");
      this.metadata.innerHTML = '<div class="stalk-comment-metadata"><span class="stalk-comment-state"></span><span class="stalk-relative-time">' + utils.secondsTohhmmss(timestamp) + '</span></div><div class="stalk-comment-readstate"></div></div>';

      msgContainer.appendChild(this.metadata);

      msgHtml = msgContainer.outerHTML;

      var classStr = 'stalk-conversation-part stalk-conversation-part-grouped';
      if (_STATUS.last != _STATUS.current) {
        if (_STATUS.current == 'admin') { // add avatar image (on the first admin message)
          msgHtml = '<img src="' + _CONFIG.admin.image + '" class="stalk-comment-avatar">' + msgHtml;
        }
        classStr = classStr + '-first';
      }
      classStr += " fromBottomToUp";
      var chatDiv = document.createElement("div");
      chatDiv.className = classStr;
      chatDiv.innerHTML = msgHtml;

      var removeClass = function() {
        this.classList.remove("fromBottomToUp");
        this.removeEventListener("animationend", removeClass, false);
      };
      chatDiv.addEventListener("animationend", removeClass, false);


      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

      _STATUS.last = _STATUS.current;
    },
    addTempImage: function(message, fileInput, tempId) {
      var div_message = document.getElementById('stalk-message');

      var msgClass = 'stalk-upload-body';
      var divClass = '';
      var divCaret = '';

      divClass = 'stalk-upload-comment stalk-upload-image';
      message = '<img id="img_' + tempId + '" src="' + message + '" style="opacity:0.8;" class="stalk-image-viewable" onclick="javascript:STALK.viewImage(this);"/>';

      var msgHtml = '<div class="stalk-comment-body-container"><div class="stalk-comment-body ' + msgClass + '">';
      msgHtml = msgHtml + message + '</div><div id="bar_' + tempId + '" class="stalk-attachment-progress-bar"><div id="progress_' + tempId + '" class="stalk-attachment-progress-percentage" style="width:0%;"></div></div></div>';

      var msgContainer = document.createElement("div");
      msgContainer.id = tempId;
      utils.addClass(msgContainer, 'stalk-comment stalk-comment-by-user ' + divClass);
      msgContainer.innerHTML = msgHtml;

      msgHtml = msgContainer.outerHTML;

      var classStr = 'stalk-conversation-part stalk-conversation-part-grouped';
      if (_STATUS.last != _STATUS.current) {
        if (_STATUS.current == 'admin') { // add avatar image (on the first admin message)
          msgHtml = '<img src="' + _CONFIG.admin.image + '" class="stalk-comment-avatar" >' + msgHtml;
        }
        classStr = classStr + '-first';
      }
      //classStr += " fromBottomToUp";
      var chatDiv = document.createElement("div");
      chatDiv.className = classStr;
      chatDiv.innerHTML = msgHtml;

      div_message.appendChild(chatDiv);
      div_message.scrollTop = div_message.scrollHeight;

      _STATUS.last = _STATUS.current;

      var msgContainer = document.querySelector(".stalk-sheet-content");
      utils.scrollTo(msgContainer, msgContainer.scrollHeight, 200);

      this.fileUpload(fileInput, tempId);
    },
    fileUpload: function(fileInput, tempId) {

      var formData = new FormData();
      formData.append("file", fileInput.files[0]);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", _CONFIG.api_server + "/upload", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          fileInput.value = "";
          var resData = JSON.parse(xhr.responseText);
          if (resData.status == 'ok') {
            if (!_CONFIG.isReady) {
              utils.requestServerInfo(STALK._callbackInit);
              _STATUS.timestamp.user = utils.currentDateStr();
            }
            var t = document.getElementById('img_' + tempId);
            t.src = resData.result.url;
            var key = encodeURIComponent(resData.result.url);
            _TempImages[key] = tempId;
            STALK.sendMessage(key, 'IM');
          }
        } else if (xhr.readyState == 4 && xhr.status != 200) {
          fileInput.value = "";
        }
      }

      xhr.upload.onprogress = function(e) {
        var done = e.position || e.loaded,
          total = e.totalSize || e.total
        var present = Math.floor(done / total * 100)
        document.getElementById('progress_' + tempId).style.width = present + '%'
      }

      xhr.setRequestHeader("XP-A", _CONFIG.app);
      xhr.setRequestHeader("XP-C", _CONFIG.channel);
      xhr.setRequestHeader("XP-U", _CONFIG.user);
      xhr.setRequestHeader("XP-FU-org", file.name);
      xhr.setRequestHeader("XP-FU-nm", file.name.substring(0, file.name.lastIndexOf(".")));
      xhr.setRequestHeader("XP-FU-tp", "image");

      xhr.send(formData);
      return false;
    },
    initEventHandler: function() {

      var constImageExtList = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

      // element event handlers
      document.getElementById('stalk-launcher-button').onclick = function(e) {
        layout.open();
      };

      if (document.getElementById('attachment') != undefined) {
        document.getElementById('attachment').onclick = function(e) {
          document.getElementById('file').click();
        };
      }

      if (document.getElementById('file') != undefined) {
        document.getElementById('file').onchange = function(e) {
          var fileInput = document.getElementById("file");
          var file = fileInput.files[0];

          var fileReader = new FileReader();
          fileReader.onload = function(e) {
            //el("img").src = e.target.result;
            var tempId = file.name + "_" + Date.now();
            var isImageType = false;
            var ext = file.name.substring(file.name.lastIndexOf(".") + 1);

            if (constImageExtList.indexOf(ext.toLowerCase()) > -1) {
              isImageType = true;
            }

            if (isImageType) {
              layout.addTempImage(e.target.result, fileInput, tempId);
            } else {
              alert('You can upload image file only');
              fileInput.value = "";
              return;
            }
          };
          fileReader.readAsDataURL(file);
        };
      }

      if (document.getElementById('stalk-image-viewer') != undefined) {
        document.getElementById('stalk-image-viewer').onclick = function(e) {
          if (this.style.display != "none") {
            this.style.display = 'none';
          }
        };
      }

      if (document.getElementById('btnClose') != undefined) {
        document.getElementById('btnClose').onclick = function(e) {
          layout.close();
        };
      }

      if (document.getElementById('btnCancel') != undefined) {
        document.getElementById('btnCancel').onclick = function(e) {
          document.getElementById('email-help').style.display = "none";
          document.getElementById('message-help').style.display = "none";
          layout.close();
        };
      }

      if (document.getElementById('btnOk') != undefined) {
        document.getElementById("btnOk").onclick = function(e) {
          document.getElementById("btnMailSend").style.display = "inline";
          document.getElementById("btnOk").style.display = "none";
          document.getElementById("form-container-content").style.display = "block";
          document.getElementById("stalk-result").style.display = "none";
        };
      }

      if (document.getElementById('btnExpandMore') != undefined) {
        document.getElementById('btnExpandMore').onclick = function(e) {
          document.getElementById('expandMenu').style.display = "block";
          document.getElementById('btnExpandMore').style.display = "none";
          document.getElementById('btnExpandLess').style.display = "block";
        };
      }

      if (document.getElementById('btnExpandLess') != undefined) {
        document.getElementById('btnExpandLess').onclick = function(e) {
          document.getElementById('expandMenu').style.display = "none";
          document.getElementById('btnExpandLess').style.display = "none";
          document.getElementById('btnExpandMore').style.display = "block";
        };
      }

      if (document.getElementById('btnApply') != undefined) {
        document.getElementById('btnApply').onclick = function() {
          var profileUrl = document.getElementById('profileUrl').value;
          var nickname = document.getElementById('nickname').value;

          if (nickname.length > 0) {
            _CONFIG.userName = nickname;
          }

          if (utils.validateURL(profileUrl)) {
            _CONFIG.userImage = profileUrl;
            document.getElementById('floating-image').src = _CONFIG.userImage;
          }

          document.getElementById('expandMenu').style.display = "none";
          document.getElementById('btnExpandLess').style.display = "none";
          document.getElementById('btnExpandMore').style.display = "block";
        }
      }

      if (document.getElementById('btnMailSend') != undefined) {
        document.getElementById('btnMailSend').onclick = function(e) {

          var name = document.getElementById('name').value;
          var message = document.getElementById('message').value;
          var email = document.getElementById('email').value;

          var url = location.href;

          var validEmail = true;
          if (email == "") {
            validEmail = false;
            document.getElementById('email-help').style.display = "block";
          }

          var validMessage = true;
          if (message == "" || message.length < 3) {
            validMessage = false;
            document.getElementById('message-help').style.display = "block";
          }

          if (!validEmail || !validMessage) {
            return;
          } else {
            document.getElementById('email-help').style.display = "none";
            document.getElementById('message-help').style.display = "none";
          }

          var sendData = {
            appkey: _CONFIG.id,
            'message': message,
            'email': email,
            'name': name,
            url: url
          };

          var _callback = function(result) {
            if (result) {
              var result = JSON.parse(result);
              if (result.timestamp) {

                document.getElementById("btnMailSend").style.display = "none";
                document.getElementById("btnOk").style.display = "inline";
                document.getElementById("form-container-content").style.display = "none";
                document.getElementById("stalk-result").style.display = "block";
              }
            }
          };

          utils.minAjax({
            url: _CONFIG.server + '/api/messages/save',
            type: "POST",
            data: sendData,
            success: _callback
          });

        };
      }

      var fncTxMessageKeydown = function(e) {

        e = root.event || e;
        var keyCode = (e.which) ? e.which : e.keyCode;

        if (keyCode == 13 && !e.shiftKey) {

          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }

          var message = _Elements.txMessage.value.toString().trim();
          //message = utils.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));
          message = encodeURIComponent(message);

          if (message !== "") {
            if (!_CONFIG.isReady) {
              utils.requestServerInfo(STALK._callbackInit);
              _STATUS.timestamp.user = utils.currentDateStr();
              //STALK._init(); 
            }
            STALK.sendMessage(message);
          }

          _Elements.txMessage.value = "";

          return false;
        }
      };

      if (_Elements.txMessage != undefined) {
        _Elements.txMessage.onkeydown = fncTxMessageKeydown;
      }

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

  if (!_CONFIG.id) {
    console.error('"id" is not existed.');
    return false;
  }

  if (!_CONFIG.channel) _CONFIG.channel = utils.getCookie("ST") == undefined ? utils.getUniqueKey() : utils.getCookie("ST"); //encodeURIComponent(/*location.hostname + */ location.pathname);
  STALK._unsendMessages = []; // send message before operator is connected!
  _STATUS.timestamp.enter = utils.currentDateStr();
  _STATUS.shortid = utils.generateShortId();

  STALK._callbackInit = function (data) {
    var tempUser = utils.getCookie("TU") == undefined ? utils.getTempUser() : utils.getCookie("TU");

    _CONFIG.user = tempUser;
    _CONFIG.userName = tempUser;

    data = JSON.parse(data);

    if (
      _CONFIG.isReady ||
      data.status != 'ok' || !data.result.server
    ) return false;
    _STATUS._server = data;

    utils.setCookie("ST", _CONFIG.channel, 1);
    utils.setCookie("TU", tempUser, 1);
    STALK._init();
  };

  STALK._init = function () {
    var data = _STATUS._server;
    var query =
      'A=' + _CONFIG.app + '&' + //+ ':' + _CONFIG.id + '&' +
      'U=' + _CONFIG.user + '&' +
      'D=' + '_' + '&' +
      'C=' + _CONFIG.channel + '&' +
        //'DT=' + JSON.stringify(_CONFIG.user) + '&' +
      'S=' + data.result.server.name;

    _CONFIG._socket = io.connect(data.result.server.url + '/channel?' + query, {
      'force new connection': true
    });

    _CONFIG._socket.on('connect', function () {

      if (!_CONFIG._isCreate) {

        var initMessage = _CONFIG.message.welcome;
        // TODO welcome 메시지 보여줄 것.
      }
      _CONFIG._isCreate = true;
      _CONFIG.isReady = true;

      _CONFIG._socket.emit('channel.join', {C: _CONFIG.channel, U: _CONFIG.admin.uid}, function (data) {
        if (data.status != 'ok') {
          console.error(data);
        }
      });

    });

    _CONFIG._socket.on("socket.address", function (data) {
      var ipAddress = data.ip.split(':')[3];
      utils.setClientIp(ipAddress);
    });

    _CONFIG._socket.on('_event', function (data) {
      if (data.event == 'CONNECTION') {
        _CONFIG.isOperatorReady = true;

        _CONFIG._socket.emit("send", {NM: "info", DT: utils.browserInfo()});
        if (STALK._unsendMessages) {
          STALK._unsendMessages.forEach(function (msg) {
            var type;
            if( msg.indexOf( "#!@!#" ) > -1 ){ 
              var tmpArr = msg.split( "#!@!#" );
              msg = tmpArr[0];
              type = tmpArr[1];
            }
            STALK.sendMessage(msg, type);
          });
          STALK._unsendMessages = [];
        }
        //layout.setTitleBar('title', data.count);
      } else if (data.event == 'DISCONNECT') {
        //layout.setTitleBar('title', data.count);
      }
    });

    _CONFIG._socket.on('message', function (data) {
      if( data.TP && data.TP == 'IM'){

        if( _TempImages[data.MG] ){
          var tid = _TempImages[data.MG];
          var timg = document.getElementById('img_'+tid);
          var tbar =  document.getElementById('bar_'+tid);
          timg.style.opacity = '1.0';
          tbar.parentNode.removeChild(tbar);
          _TempImages[data.MG] = undefined;

          var metadata = document.createElement("div");
          utils.addClass(metadata, "stalk-comment-metadata-container");
          metadata.innerHTML = '<div class="stalk-comment-metadata"><span class="stalk-comment-state"></span><span class="stalk-relative-time">' + utils.secondsTohhmmss(data.TS) + '</span></div><div class="stalk-comment-readstate"></div></div>';

          var msgContainer = document.getElementById(tid);
          msgContainer.appendChild(metadata);

          var msgContainer = document.querySelector(".stalk-sheet-content");
          utils.scrollTo(msgContainer, msgContainer.scrollHeight, 200);        
          return;
        }
      }

      layout.addMessage(data.MG, data.TS, data.user, data.TP);
      var msgContainer = document.querySelector(".stalk-sheet-content");
      utils.scrollTo(msgContainer, msgContainer.scrollHeight, 400);
    });
  };

  STALK.sendMessage = function (msg, type) {
    if (!_CONFIG.isOperatorReady) {
      return STALK._unsendMessages.push(msg+(type?"#!@!#"+type:""));
    }
    var param = {
      A: _CONFIG.app,// + ':' + _CONFIG.id,
      C: _CONFIG.channel,
      NM: 'message',
      DT: {
        user: _CONFIG.user,
        MG: msg,
        UO: {
          U: _CONFIG.user,
          NM: _CONFIG.userName,
          I: _CONFIG.userImage || ''
        }
      }
    };
    if( type ){
      param.DT.TP = type;
    } else if( utils.validateURL( param.DT.MG ) ){
      param.DT.TP = 'LN';
    }

    _CONFIG._socket.emit('send', param, function (data) {
    });
  };

  STALK.getVersion = function () {
    return version;
  };

  STALK.viewImage = function(obj){
    if( obj.src ){

      var zoomImg = document.getElementById( "stalk-zoomed-image" );
      var maxWidth = window.innerWidth - 80;
      var w;
      var h;
      var ratio = ( obj.naturalWidth / obj.naturalHeight) ;

      var isMaxWidth = false;
      if( maxWidth > obj.naturalWidth ) {
        w =  obj.naturalWidth;
      } else {
        isMaxWidth = true;
        w = maxWidth;
      }

      var isMaxHeight = false;
      var maxHeight = window.innerHeight - 80;
      if( maxHeight  > obj.naturalHeight ){
        h = obj.naturalHeight;
      } else {
        isMaxHeight = true;
        h = maxHeight;
      }

      if( isMaxWidth && isMaxHeight ){
        if( obj.naturalWidth > obj.naturalHeight ){
          h = w / ratio;
        } else {
          w = h * ratio;
        }
      } else if( isMaxWidth ){
        h = w / ratio;
      } else if ( isMaxHeight ){
        w = h * ratio;
      }
      zoomImg.style.width = w+"px";
      zoomImg.style.height = h+"px";
      zoomImg.style.left = ( window.innerWidth - w ) / 2+"px";
      zoomImg.style.top = ( window.innerHeight - h ) / 2+"px";
      zoomImg.src = obj.src;
      zoomImg.onload = function(){
        if( document.getElementById( "stalk-image-viewer" ) ){
          document.getElementById( "stalk-image-viewer" ).style.display = "block";
        }
      };
    }
  };

  STALK.init = function () {
    layout.initWin();
    utils.onLeaveSite();
    utils.onChangeUrl();
  };

  STALK.init();

}(this));
