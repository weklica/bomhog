var cheerio = require('cheerio');
var request = require('request');
var bomUrls = require('./bomUrls.js');
var jsonWriter = require('./jsonWriter');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	return;
}

var nav = [];
console.log('Requesting nav data');
request(bomUrls.nav + language, function (error, response, body) {
  if (!error && response.statusCode == 200) {
	console.log('\tGot nav data');
    $ = cheerio.load(body);
	$('div.table-of-contents a:not([href*=illustration])').each(function() {
		nav.push({text:$(this).text(),abbr:$(this).attr('href').substr(36).replace('?lang=' + language, '').replace('/1', '')});
	});
	
	jsonWriter(language, null, 'nav.json', JSON.stringify(nav));
  }
});

console.log('Requesting title page data');
request(bomUrls.title + language, function(err, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot title page data');
		$ = cheerio.load(body);
		
	}
});


return;

console.log('Requesting introduction data');
request(bomUrls.title + language, function(err, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot introduction data');
		$ = cheerio.load(body);
		
	}
});

console.log('Requesting explanation data');
request(bomUrls.title + language, function(err, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot explanation data');
		$ = cheerio.load(body);
		
	}
});

// for (var i = 0; i < bomUrls.chapters.length; i++) {
	// console.log(bomUrls.chapters[i].book + ' ' + bomUrls.chapters[i].chapter);
// }