var fs = require('fs');
var path = require('path');

module.exports = function(language, book, fileName, fileContents) {
	var dataDir = path.join(__dirname, 'data');
	var langDir = path.join(dataDir, language);
	
	if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
	if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);
	
	if (book) langDir  = path.join(langDir, book);
	
	var fileName = path.join(langDir, fileName);
	
	fs.writeFile(fileName, fileContents, function (err) {
		if (err) throw err;
		console.log('\tSaved ' + fileName);
	});
}