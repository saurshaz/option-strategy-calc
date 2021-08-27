




// http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
// http://stackoverflow.com/questions/9263671/google-chome-application-shortcut-how-to-auto-load-javascript/9310273#9310273

function injectScript(url, callback) {
  var s = document.createElement('script');
  //   var url = window.chrome.extension.getURL(url);
  s.src = url;
  (document.head||document.documentElement).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
    if (callback) {
      callback.call(this);
    }
  };
}
  
function handlePassToBackground(evt) {
  // https://developer.chrome.com/extensions/messaging#simple
  window.chrome.runtime.sendMessage(evt.detail, function(response) {
    var message = {
      action: evt.detail.action,
      callbackKey: response.callbackKey,
      result: response.result,
    };
    var event = new CustomEvent('PassToPage', {detail: message});
    window.dispatchEvent(event);
  });
}
  
window.addEventListener('PassToBackground', handlePassToBackground, false);
  
injectScript('zepto.js', function() {
  injectScript('page.js');
});
  