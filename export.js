const fs = require('fs');

console.log((new Date()).toString(), '| export start');


let sourceCode = '// -- -- -- -- -- -- -- -- -- -- -- --\n// "Artist.js" 2D Graphic Framework\n// -- -- -- -- -- -- -- -- -- -- -- --\n';
fs.readdir(__dirname + '/resources/js', (err, fileList) => {
  for (const fileName of fileList) {
    if (fileName.includes('.js') === true && fileName !== 'index.js') {
      let fileCode = (fs.readFileSync(__dirname + '/resources/js/' + fileName, 'utf8')).split('//#CodeStart')[1];
      fileCode = fileCode.replace(/export /gi, '');
      sourceCode += fileCode + '\n';
    }
  }
  fs.writeFileSync(__dirname + '/product/artist.js', sourceCode, 'utf8');
  console.log((new Date()).toString(), '| export done');
});