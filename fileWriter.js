var fs = require('fs');
var path = require('path');

module.exports = function(root, language, book, fileName, fileContents) {
	var rootDir = path.join(__dirname, root);
	var langDir = path.join(rootDir, language);
	
	if (!fs.existsSync(rootDir)) {
		fs.mkdirSync(rootDir);
	}
	
	if (!fs.existsSync(langDir)) {
		fs.mkdirSync(langDir);
	}
	
	if (book) langDir  = path.join(langDir, book);
	
	if (!fs.existsSync(langDir)) {
		fs.mkdirSync(langDir);
	}
	
	var fileName = path.join(langDir, fileName);
	
	fs.writeFile(fileName, fileContents, function (err) {
		if (err) throw err;
		console.log('\tSaved ' + fileName);
	});
}