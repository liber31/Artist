const fs = require('fs');

console.log((new Date()).toString(), '| export start');


let sourceCode = '// -- -- -- -- -- -- -- -- -- -- -- --\n// "Artist.js" 2D Graphic Framework\n// -- -- -- -- -- -- -- -- -- -- -- --\n';

function load(dir) {
	const fileList = fs.readdirSync(dir);
	for (const fileName of fileList) {
		if (fileName.includes('.js') === true && fileName !== 'index.js') {
			let fileCode = (fs.readFileSync(dir + '/' + fileName, 'utf8')).split('//#CodeStart')[1];
			fileCode = fileCode.replace(/export /gi, '');
			sourceCode += fileCode + '\n';
		} else if (fileName.includes('.') === false) {
			load(dir + '/' + fileName)
		}
	}
}

load(__dirname + '/resources/artist');
fs.writeFileSync(__dirname + '/product/artist.js', sourceCode, 'utf8');

console.log((new Date()).toString(), '| export done');