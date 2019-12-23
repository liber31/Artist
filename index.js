var express = require('express');
var app = express();
var fs = require('fs');
var decode = require('urldecode');

app.get('*', function(req, res) {
  req.url = decode(req.url);
  var url = '/html/index.html';
  var type = 0; // 0 is string, other is buffer
  if (req.url.length > 1) {
    try {
      var operation = req.url.split('/')[1];
      if (operation === 'css' || operation === 'img' || operation === 'js') {
        url = req.url;
        if (operation === 'img') {
          type = 1;
        }
        if (operation === 'css') {
          type = 2;
        }
      } else {
        url = req.url + '.html';
      }
    } catch (err) {}
  }

  fs.readFile(`${__dirname}/src${url}`, (err, data) => {
    if (err) {
      res.send('Error');
    } else {
      if (type === 1) {
        res.type('png');
        res.send(data);
      } else if (type === 0) {
        res.type('html');
        res.send(data);
      } else if (type === 2) {
        res.type('css');
        res.send(data);
      }
    }
  });
});

app.listen(3000, () => {
  console.log('[Index] Website is now avaliable');
});
