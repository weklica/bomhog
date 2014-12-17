var cheerio = require('cheerio');
var request = require('request');
var bomUrls = require('./bomUrls.js');

for (var i = 0; i < bomUrls.length; i++) {
	console.log(bomUrls[i].book + ' ' + bomUrls[i].chapter);
}