const fs = require('fs');

console.log((new Date()).toString(), '| export start');


let sourceCode = '';
fs.readdir(__dirname + '/resources/js', (err, fileList) => {
  for (const fileName of fileList) {
    if (fileName.includes('.js') === true && fileName !== 'index.js') {
      const fileCode = (fs.readFileSync(__dirname + '/resources/js/' + fileName, 'utf8')).split('//#CodeStart')[1];
      sourceCode += fileCode + '\n';
    }
  }
  fs.writeFileSync(__dirname + '/product/artist.js', sourceCode, 'utf8');
  console.log((new Date()).toString(), '| export done');
});