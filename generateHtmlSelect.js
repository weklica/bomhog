var fs = require('fs');
var path = require('path');

var selLang1 = '<select id="selLang1">';
selLang1 += '\r\n\t<option></option>';
var selLang2 = '\r\n\r\n<select id="selLang2">';
selLang2 += '\r\n\t<option></option>';

var readDir = path.join(__dirname, 'json'); 
var languages = fs.readdirSync(readDir).filter(function(file) {
	return fs.statSync(path.join(readDir, file)).isDirectory();
});

for (var i = 0; i < languages.length; i++) {
	var navData = fs.readFileSync(path.join(__dirname, 'json', languages[i], 'nav.json'), { encoding: 'utf-8'});
	navData = JSON.parse(navData);
	var dataBooks = '';
	for (var j = 0; j < navData.books.length; j++) {
		dataBooks += navData.books[j].text + ',';
	}
	selLang1 += '\r\n\t<option value="' + languages[i] + '" data-books="' + dataBooks + '">' + navData.languageName + '</option>';
	selLang2 += '\r\n\t<option value="' + languages[i] + '"></option>';
}

selLang1 += '\r\n</option>';
selLang2 += '\r\n</option>';

fs.writeFileSync(path.join(__dirname, 'select.html'), selLang1 + selLang2, 'utf-8');