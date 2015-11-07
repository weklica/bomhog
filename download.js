var request = require('request');
var bomUrls = require('./bomUrls.js');
var fileWriter = require('./fileWriter.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	process.exit();
}

console.log('Requesting nav data');
request(bomUrls.nav + language, function (error, response, body) {
  if (!error && response.statusCode == 200) {
	console.log('\tGot nav data');
    fileWriter('html', language, null, 'nav.html', body);
  } else {
	  console.log(error, response.statusCode);
	  process.exit();
  }
});

console.log('Requesting title page data ' + bomUrls.title + language);
request(bomUrls.title + language, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot title page data');
		fileWriter('html', language, 'bofm-title', '1.html', body);
	} else {
		console.log(error, response.statusCode);
		process.exit();
	}
});


console.log('Requesting introduction page data ' + bomUrls.introduction + language);
request(bomUrls.introduction + language, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot introduction page data');
		fileWriter('html', language, 'introduction', '1.html', body);
	} else {
		console.log(error, response.statusCode);
		process.exit();
	}
});


console.log('Requesting explanation page data ' + bomUrls.explanation + language);
request(bomUrls.explanation + language, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot explanation response');
		fileWriter('html', language, 'explanation', '1.html', body);
	} else {
		console.log(error, response.statusCode);
		process.exit();
	}
});


bomUrls.chapters.forEach(function(element) {
	console.log('Requesting chapter ' + element.url + language);
	request(element.url + language, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot response for ' + element.url);
			fileWriter('html', language, element.book, element.chapter + '.html', body);
		}
	});
});