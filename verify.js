var bomUrls = require('./bomUrls.js');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	process.exit();
}

function logError(error) {
	console.log(chalk.bgRed('----------------------------------------------------------------------------------------'));
	console.log(chalk.bgRed(error));
	console.log(chalk.bgRed('----------------------------------------------------------------------------------------'));
}

function logSuccess(message) {
	console.log(chalk.bgGreen(message));
}

var readDir = path.join(__dirname, 'json', language);
var json = null;

fs.readFile(path.join(readDir, 'nav.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.length != 19) logError('Expected 19 objects in nav.json, found ' + json.length);
		logSuccess('Verified nav.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'welcome', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in welcome.json, found ' + json.heading);
		if (json.prevAbbr != 'welcome') logError('Expected welcome as prevAbbr in welcome.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'bofm-title') logError('Expected bofm-title as nextAbbr in welcome.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in welcome.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in welcome.json, found ' + json.nextNo);
		if (!json.verses || json.verses.length != 4) logError('Expected 4 verses in welcome.json, found ' + (json.verses ? json.verses.length : '?'));
		logSuccess('Verified welcome/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'bofm-title', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in bofm-title/1.json, found ' + json.heading);
		if (json.prevAbbr != 'welcome') logError('Expected welcome as prevAbbr in bofm-title/1.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'introduction') logError('Expected introduction as nextAbbr in bofm-title/1.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in bofm-title/1.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in bofm-title/1.json, found ' + json.nextNo);
		if (!json.chapterTitle) logError('Expected chapterTitle in bofm-title/1.json, found nothing');
		if (!json.verses || json.verses.length != 5) logError('Expected 5 verses in bofm-title/1.json, found ' + (json.verses ? json.verses.length : '?'));
		
		if (!json.verses[1].isHeader) logError('Expected first verse of bofm-title/1.json to be isHeader, found otherwise');
		
		json.verses.forEach(function(verse, index) {
			if (!verse.hideNumber) logError('Expected verse number in bofm-title/1.json to be hidden, found ' + verse.vNo);
		});
		
		logSuccess('Verified bofm-title/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'introduction', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		if (json.heading) logError('Expected no heading in introduction/1.json, found ' + json.heading);
		if (json.prevAbbr != 'bofm-title') logError('Expected bofm-title as prevAbbr in introduction/1.json, found ' + json.prevAbbr);
		if (json.nextAbbr != 'explanation') logError('Expected explanation as nextAbbr in introduction/1.json, found ' + json.nextAbbr);
		if (json.prevNo != 1) logError('Expected 1 as prevNo in introduction/1.json, found ' + json.prevNo);
		if (json.nextNo != 1) logError('Expected 1 as nextNo in introduction/1.json, found ' + json.nextNo);
		if (!json.chapterTitle) logError('Expected chapterTitle in introduction/1.json, found nothing');
		if (!json.verses || json.verses.length != 51) logError('Expected 51 verses in introduction/1.json, found ' + (json.verses ? json.verses.length : '?'));
		
		if (json.verses[10].length < 500) logError('Expected eleventh verse of introduction/1.json to be long (testimony of 3 witnesses), found length ' + json.verses[10].length);
		if (json.verses[11].length > 20) logError('Expected twelfth verse of introduction/1.json to be short (Oliver Cowdery), found length ' + json.verses[11].length);
		if (json.verses[15].length < 500) logError('Expected sixteenth verse of introduction/1.json to be long (testimony of 8 witnesses), found length ' + json.verses[15].length);
		if (json.verses[16].length > 20) logError('Expected seventeenth verse of introduction/1.json to be short (Christian Whitmer), found length ' + json.verses[16].length);
		if (json.verses[24].length > 40) logError('Expected twenty-fifth verse of introduction/1.json to be short ("Testimony of the prophet..."), found length ' + json.verses[24].length);
		
		json.verses.forEach(function(verse, index) {
			if (!verse.hideNumber) logError('Expected verse number in introduction/1.json to be hidden, found ' + verse.vNo);
		});
		logSuccess('Verified introduction/1.json');
	} else {
		logError(error);
	}
});

fs.readFile(path.join(readDir, 'explanation', '1.json'), function(error, data) {
	if (!error) {
		json = JSON.parse(data);
		logSuccess('Verified explanation/1.json');
	} else {
		logError(error);
	}
});

bomUrls.chapters.forEach(function(element, index) {
	fs.readFile(path.join(readDir, element.book, element.chapter + '.json'), function(error, data) {
		if (!error) {
			json = JSON.parse(data);
			logSuccess('Verified ' + element.book + '/' + element.chapter + '.json');
		} else {
			logError(error);
		}
	});
});
