var cheerio = require('cheerio');
var bomUrls = require('./bomUrls.js');
var fileWriter = require('./fileWriter');
var welcomeData = require('./welcomeData');
var fs = require('fs');
var path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var language = process.argv[2];
if (!language) {
	console.log('No language code specified.  Exiting.');
	process.exit();
}

var $ = null;
var page = null;
var verse = null;
var vNo = 0;
var readDir = path.join(__dirname, 'html', language);
var navAbbrs = ["welcome","bofm-title","introduction","explanation","1-ne","2-ne","jacob","enos","jarom","omni","w-of-m","mosiah","alma","hel","3-ne","4-ne","morm","ether","moro"];

console.log('Processing welcome.json');
fileWriter('json', language, 'welcome', '1.json', JSON.stringify(welcomeData));

var navhtml = fs.readFileSync(path.join(readDir, 'nav.html'), {encoding: 'utf-8'});
$ = cheerio.load(navhtml);
var nav = {languageName: $('a.pf-prefix.pf-icon-language').text(), books: [{text:"Welcome", abbr: "welcome"}]};
$('div.table-of-contents a:not([href*=illustration])').each(function() {
	var startPos = ($(this).attr('href').indexOf('//bofm') > -1) ? 37 : 36;
	var abbr = $(this).attr('href').substr(startPos).replace('?lang=' + language, '').replace('/1', '');
	if (navAbbrs.indexOf(abbr) > -1) {
		nav.books.push({text:$(this).text(),abbr:abbr});
	}
});

fileWriter('json', language, null, 'nav.json', JSON.stringify(nav));


var bofmtitle = fs.readFileSync(path.join(readDir, 'bofm-title', '1.html'), {encoding: 'utf-8'});
console.log('Processing bofm-title/1.json');
$ = cheerio.load(bofmtitle);
var titlePage = {};
titlePage.heading = '';
titlePage.prevAbbr = "welcome";
titlePage.nextAbbr = "introduction";
titlePage.prevNo = 1,
titlePage.nextNo = 1,
titlePage.chapterTitle = $('h1 .dominant').text();
titlePage.verses = [];
titlePage.verses.push({ txt: $('#primary .subtitle').text(), isHeader: true });

$('#0 p').each(function() {
	verse = { txt: $(this).text().replace(/\s+/g, ' ').trim() };
	titlePage.verses.push(verse);
});	

fileWriter('json', language, 'bofm-title', '1.json', JSON.stringify(titlePage));



var intro = fs.readFileSync(path.join(readDir, 'introduction', '1.html'), {encoding: 'utf-8'});
console.log('Processing introduction/1.json');
$ = cheerio.load(intro);
var introPage = {
	heading: '',
	prevAbbr: 'bofm-title',
	nextAbbr: 'explanation',
	prevNo: 1,
	nextNo: 1,
	chapterTitle: $('#details ul.filed-under > li:last-child').text().trim(),
	verses: []				
};

vNo = 1;
$('#0').find('p,div>h2,.signature,.smallCaps').each(function() {
	if ($(this).text().trim()) {
		if ((vNo == 12 || vNo == 17) && ['spa','kor','zho'].indexOf(language) > -1) {
			// a few languages have all signatures in the same element, using <br> to separate
			var split = $(this).html().split('<br>');
			for (var i = 0; i < split.length; i++) {
				introPage.verses.push({ txt: split[i].replace(/\s+/g, ' ').trim() });
				vNo++;
			}
		} else if ($(this).find('.signature,.smallCaps').length == 0) {
			introPage.verses.push({ txt:$(this).text().replace(/\s+/g, ' ').trim()});
			vNo++;
		}
	}
});
		
// these languages keep additional intro info separated
if (['chk','eng','hin','kos','mah','pes','por','xho','zul'].indexOf(language) > -1) {
	var three = fs.readFileSync(path.join(readDir, 'three', '1.html'), {encoding: 'utf-8'});
	$ = cheerio.load(three);
	introPage.verses.push({ txt: $('h1').text().replace(/\s+/g, ' ').trim() });
	introPage.verses.push({ txt: $('#0 p:first-child').text().replace(/\s+/g, ' ').trim() });
	$('#0 div.signature').each(function() {
		introPage.verses.push({ txt: $(this).text().replace(/\s+/g, ' ').trim() });
	});
			
	var eight = fs.readFileSync(path.join(readDir, 'eight', '1.html'), {encoding: 'utf-8'});
	$ = cheerio.load(eight);
	introPage.verses.push({ txt: $('h1').text().replace(/\s+/g, ' ').trim() });
	introPage.verses.push({ txt: $('#0 p:first-child').text().replace(/\s+/g, ' ').trim() });
	$('#0 div.signature').each(function() {
		introPage.verses.push({ txt: $(this).text().replace(/\s+/g, ' ').trim() });
	});
	
	var js = fs.readFileSync(path.join(readDir, 'js', '1.html'), {encoding: 'utf-8'});
	$ = cheerio.load(js);
	introPage.verses.push({ txt: $('h1').text().replace(/\s+/g, ' ').trim() });
	$('#0 > p').each(function() {
		introPage.verses.push({ txt: $(this).text().replace(/\s+/g, ' ').trim() });
	});
}
	
fileWriter('json', language, 'introduction', '1.json', JSON.stringify(introPage));


fs.readFile(path.join(readDir, 'explanation', '1.html'), function(error, data) {
	if (!error) {
		console.log('Processing explanation/1.json');
		$ = cheerio.load(data);
		var explanationPage = {
			heading: '',
			prevAbbr: 'introduction',
			nextAbbr: '1-ne',
			prevNo: 1,
			nextNo: 1,
			chapterTitle: $('h1').text().replace(/\s+/g, ' ').trim(),
			verses: []
		};
		
		$('#0').find('p,li').each(function() {
			explanationPage.verses.push({ txt:$(this).text().replace(/\s+/g, ' ').trim() });
		});
		
		fileWriter('json', language, 'explanation', '1.json', JSON.stringify(explanationPage));
	} else {
		console.log(error);
		process.exit();
	}
});

bomUrls.chapters.forEach(function(element, index) {
	fs.readFile(path.join(readDir, element.book, element.chapter + '.html'), function(error, data) {
		if (!error) {
			console.log('Processing ' + element.book + '/' + element.chapter + '.json');
			$ = cheerio.load(data);
			page = { heading: $('#primary .summary p').text().replace(/\s+/g, ' ').trim() };
			
			if ($('#primary .intro').length > 0) page.sectionHeading = $('#primary .intro').text().replace(/\s+/g, ' ').trim();
			
			if (index == 0) {
				page.prevAbbr = 'explanation';
				page.prevNo = 1;
			} else {
				page.prevAbbr = bomUrls.chapters[index -1].book;
				page.prevNo = bomUrls.chapters[index -1].chapter;
			}
			
			if (index == bomUrls.chapters.length - 1) {
				page.nextAbbr = 'welcome';
				page.nextNo = 1;
			} else {
				page.nextAbbr = bomUrls.chapters[index + 1].book;
				page.nextNo = bomUrls.chapters[index + 1].chapter;
			}

			page.chapterTitle = $('#details ul.filed-under:first-child > li:nth-child(4)').text().replace(/\s+/g, ' ').trim();
			
			var chapterNumber = $('#details ul.filed-under:first-child > li:nth-child(5)').text();
			if (chapterNumber.length > 0) page.chapterTitle += ' ' + chapterNumber;
			
			page.verses = [];
			
			vNo = 1;
			$('#0>p').each(function() {
				var customVerseNumber = $(this).find('span.verse').text();
				$(this).find('a.bookmark-anchor,span.verse,sup,div.signature,div.summary').remove();
				verse = $(this).text().replace(/\s+/g, ' ').trim();
				if (verse) page.verses.push({ vNo: customVerseNumber || vNo++, txt: verse });
			});
			
			fileWriter('json', language, element.book, element.chapter + '.json', JSON.stringify(page));
		} else {
			console.log(error);
			process.exit();
		}
	});
});
