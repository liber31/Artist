async function request(url, object) {
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest();
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        console.log('[HTTP RECV]', http.responseText);
        resolve(JSON.parse(http.responseText));
      }
    };
    console.log('[HTTP SEND]', JSON.stringify(object));
    http.send(JSON.stringify(object));
  });
}
