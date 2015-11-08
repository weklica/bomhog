var request = require('request');
var bomUrls = require('./bomUrls.js');
var fileWriter = require('./fileWriter.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	process.exit();
}

var useProxy = process.argv[3] && process.argv[3] == '-proxy';

function createRequest(url) {
	return {
    	method: "GET",
    	uri: url,
    	proxy: useProxy ? "http://127.0.0.1:8888" : undefined
	};
}

console.log('Requesting nav data');
request(createRequest(bomUrls.nav + language), function (error, response, body) {
  if (!error && response.statusCode == 200) {
	console.log('\tGot nav data');
    fileWriter('html', language, null, 'nav.html', body);
  } else {
	  console.log(error, response ? response.statusCode : '');
	  process.exit();
  }
});

console.log('Requesting title page data ' + bomUrls.title + language);
request(createRequest(bomUrls.title + language), function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot title page data');
		fileWriter('html', language, 'bofm-title', '1.html', body);
	} else {
		console.log(error, response ? response.statusCode : '');
		process.exit();
	}
});


console.log('Requesting introduction page data ' + bomUrls.introduction + language);
request(createRequest(bomUrls.introduction + language), function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot introduction page data');
		fileWriter('html', language, 'introduction', '1.html', body);
	} else {
		console.log(error, response ? response.statusCode : '');
		process.exit();
	}
});

if (['chk','eng','hin','kos','mah','pes','por','xho','zul'].indexOf(language) > -1) {
	console.log('Requesting three page data ' + bomUrls.threeWitness + language);
	request(createRequest(bomUrls.threeWitness + language), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot three page data');
			fileWriter('html', language, 'three', '1.html', body);
		} else {
			console.log(error, response ? response.statusCode : '');
			process.exit();
		}
	});
	
	console.log('Requesting eight page data ' + bomUrls.eightWitness + language);
	request(createRequest(bomUrls.eightWitness + language), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot Eight page data');
			fileWriter('html', language, 'eight', '1.html', body);
		} else {
			console.log(error, response ? response.statusCode : '');
			process.exit();
		}
	});
	
	console.log('Requesting JS page data ' + bomUrls.jsWitness + language);
	request(createRequest(bomUrls.jsWitness + language), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot JS page data');
			fileWriter('html', language, 'js', '1.html', body);
		} else {
			console.log(error, response ? response.statusCode : '');
			process.exit();
		}
	});
}


console.log('Requesting explanation page data ' + bomUrls.explanation + language);
request(createRequest(bomUrls.explanation + language), function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log('\tGot explanation response');
		fileWriter('html', language, 'explanation', '1.html', body);
	} else {
		console.log(error, response ? response.statusCode : '');
		process.exit();
	}
});


bomUrls.chapters.forEach(function(element) {
	console.log('Requesting chapter ' + element.url + language);
	request(createRequest(element.url + language), function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\tGot response for ' + element.url);
			fileWriter('html', language, element.book, element.chapter + '.html', body);
		} else {
			console.log('Failed: ' + element.url + language);
			console.log('\t' + error, response ? response.statusCode : '');
		}
	});
});