/** 해당 url로 post request를 보냅니다. */
export async function request(url, object) {
    return new Promise((resolve, _reject) => {
        let http = new XMLHttpRequest();
        http.open('POST', url, true);

        http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                if (window.variables.debug == true) console.log('[HTTP RECV]', http.responseText);

                resolve(JSON.parse(http.responseText));
            }
        };
        if (window.variables.debug == true) console.log('[HTTP SEND]', JSON.stringify(object));

        http.send(JSON.stringify(object));
    });
}
