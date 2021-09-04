
// var message = {
//   action: 'getCookies',
//   url: 'https://kite.zerodha.com/',
//   cookieName: 'enctoken',
//   callback: function(result) {
//     alert(result);
//     var cookieText = result.cookieName + '=' + result.cookieValue;
//     // $('#target-cookie').text('target cookie: ' + cookieText);

//     passToBackground({
//       action: 'xhr',
//       xhr: {
//         url: 'http://faketarget:8192/status',
//         headers: {cookie: cookieText},
//       },
//       callback: function(result) {
//         // data, status, xhr
//         alert(result.responseText);
//       },
//     });
//   },
// };



// // The async IIFE is necessary because Chrome <89 does not support top level await.
// window.chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
//   console.log('MANAGER');
//   if (tab && tab[0]?.url) {
//     try {
//       let url = new URL(tab[0].url);
//       let name = 'World';
//       window.chrome.scripting.executeScript({
//         target: {tabId: tab[0].id},
//         func: showAlert,
//         args: [name]
//       });
//       // input.value = url.hostname;
//       console.log(url);
//     } catch {}
//   }
// });
  
export function showAlert(message) {
  console.log(window.localStorage.getItem(''));
  // alert(message);
}
  
  
export function getLastThursday(month) {
  var d = new Date(`01-${month}-${2021}`),
    thursdays = [];
  d.setDate(1);
  
  d.setMonth(month);
  
  // Get the first thursdays in the month
  while (d.getDay() !== 4) {
    d.setDate(d.getDate() + 1);
  }
  
  // Get all the other thursdays in the month
  while (d.getMonth() === month) {
    thursdays.push(new Date(d.getTime()));
    d.setDate(d.getDate() + 7);
  }
  
  return (thursdays[4] || thursdays[3]).getDate();
}