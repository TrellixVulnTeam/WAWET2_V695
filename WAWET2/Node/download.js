const fs = require('fs');
const download = require('download');
if (typeof require !== 'undefined') XLSX = require('xlsx');


const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cheerio = require('cheerio');
var request = require('request');


var jsdom = require('jsdom'); 







var url0 = "http://www.ync.ac.kr/kor/CMS/Board/Board.do?mCode=MN217";
download(url0).then(data => {
    fs.writeFileSync('test.html', data);

    fs.readFile('./test.html', 'utf8', function (err, data) {

        $ = cheerio.load(data);
        url2 = "http://www.ync.ac.kr/kor/CMS/Board/Board.do" + $('p').find('a').attr('href');

        download(url2).then(data => {
            fs.writeFileSync('test1.html', data);
            fs.readFile('./test1.html', 'utf8', function (err, data) {

                $ = cheerio.load(data);

                url = "http://www.ync.ac.kr" + $('.board-view-filelist').find('a').attr('href')

                download(url).then(data => {
                    fs.writeFileSync('test1.xls', data);
                
                
                    var workbook = XLSX.readFile('test1.xls');
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var address_of_cell = 'A3';
                    var desired_cell = worksheet[address_of_cell];
                    var desired_value = desired_cell.v;
            
            
                    var nemu = new Array();
                    if (desired_value.match('교직원') == '교직원') {
                        var staff = new Array();
                        //방학떄
                        //  console.log("방학때");
                        for (let i = 66; i <= 70; i++) {
                            var staff = new Array();
                            //  console.log(String.fromCharCode(i)+5);
                            //  console.log(worksheet[String.fromCharCode(i) + 4])
                            
                            for (let j = 3; j <= 10; j++) {
                                
                                if (worksheet[String.fromCharCode(i) + j] != undefined) {
                                    // console.log(String.fromCharCode(i)+j);
                                    // console.log(worksheet[String.fromCharCode(i)+j].v);
                                    if (j == 10) {
                                        //학생식당 
                                        var student = new Array();
                                        student.push(worksheet[String.fromCharCode(i) + j].v);
                                    } else {
                                        //교직원식당
                                        // console.log(worksheet[String.fromCharCode(i) + j]);
                                        if (worksheet[String.fromCharCode(i) + j] == undefined) continue;
                                        staff.push(worksheet[String.fromCharCode(i) + j].v);
                                    }
            
                                } else {
                                    continue;
                                }//end if 
            
                            }//매뉴
            
                            var MM;
                            var DD;
                            var data = worksheet[String.fromCharCode(i) + 2].v;
            
                            if (data.substring(0, 2).match('월') == '월') {
                                MM = "0" + data.substring(0, 1);
            
                                if (data.substring(3, 5).match('일') == '일') {
                                    DD = "0" + data.substring(3, 4);
                                } else {
                                    DD = data.substring(3, 5);
                                }
            
                            } else {
                                MM = data.substring(0, 2);
                                if (data.substring(4, 6).match('일') == '일') {
                                    DD = "0" + data.substring(4, 5);
                                } else {
                                    DD = data.substring(4, 6);
                                }
                            }
                            var YY = new Date().getYear().toString().substring(1, 3);
                            var toDatNemu = new Object();
                            toDatNemu.data = YY + "-" + MM + "-" + DD;
                            toDatNemu.Vacation = true
                            toDatNemu.staff = staff
                            toDatNemu.student = student
                            nemu.push(toDatNemu);
            
                        }//날짜 
                    } else {
                        //정상등교
                        console.log("정상등교");
                    }
            
                    var jsonInfo = JSON.stringify(nemu);
                    console.log(jsonInfo);
                    jsdom.env({  
                        html: "index.html",
                        done: function(errors, window){
                            window.document.getElementsByTagName('p').text() = jsonInfo;

                        }
                    });
                });
            });
        });
    });
});