(function (global) {

  var root = global;

  var divLauncher = document.getElementById('stalk-launcher');
  var btnLauncher = document.getElementById('stalk-launcher-button');
  var divChatbox = document.getElementById('stalk-chatbox');

  var txMessage = document.getElementById('txMessage');

  var utils = {
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
    getEscapeHtml: function (html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
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
    }
  };

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

      var message = txMessage.value;
      message = utils.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));

      if (message.length > 0) {

        //STALK.sendMessage(encodeURIComponent(message));
        txMessage.value = '';
        //alert(message);

      }
    }
  };


}(this));