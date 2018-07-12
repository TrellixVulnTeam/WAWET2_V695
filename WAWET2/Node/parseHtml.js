var cheerio = require('cheerio');
var request = require('request');
const fs = require('fs');
const download = require('download');

var url = "http://www.ync.ac.kr/kor/CMS/Board/Board.do?mCode=MN217";
download(url).then(data => {
    fs.writeFileSync('test.html', data);
    fs.readFile('./test.html', 'utf8', function (err, data) {

        $ = cheerio.load(data);
        url2 = "http://www.ync.ac.kr/kor/CMS/Board/Board.do" + $('p').find('a').attr('href');

        download(url2).then(data => {
            fs.writeFileSync('test1.html', data);
            fs.readFile('./test1.html', 'utf8', function (err, data) {

                $ = cheerio.load(data);

                var fileUrl = "http://www.ync.ac.kr" + $('.board-view-filelist').find('a').attr('href')
                console.log(fileUrl);
            });
        });
    });
});









