var cheerio = require('cheerio');
var request = require('request');


////
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
const download = require('download');
if (typeof require !== 'undefined') XLSX = require('xlsx');

var url
app.get('/', function (req, res) {

    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');

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
                        fs.writeFileSync('test.xls', data);
                
                
                        var workbook = XLSX.readFile('test.xls');
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
                                            if (worksheet[String.fromCharCode(i) + j] == undefined) continue;
                                            if (worksheet[String.fromCharCode(i) + j].v == '*') continue;
                                            staff.push(worksheet[String.fromCharCode(i) + j].v);
                                        }
                
                                    } else {
                                        continue;
                                    }//end if 
                
                                }//매뉴
                              
                                var toDatNemu = new Object();
                                toDatNemu.data = getMenuDay(worksheet[String.fromCharCode(i) + 2].v);
                                toDatNemu.Vacation = true
                                toDatNemu.staff = staff
                                toDatNemu.student = student
                                nemu.push(toDatNemu);
                
                            }//날짜 
                        } else {
                            //정상등교
                            console.log("정상등교");
                            // nill 카운트
   
                          
                            var myArray = new Array();
                            var section=0;
                            var start = 3;
                            var end = 0;
                            var Flag = true

                            for (let j = 2; j <= 10000 ; j++) {

                                // console.log(worksheet[String.fromCharCode(65) + j])
                                // console.log(+"   "+j)
                                if(section == 4){
                                    break
                                    end == j
                                    myArray.push(new Array(start,end))
                                }
                                if(worksheet[String.fromCharCode(65) + j] != undefined){
                                    // console.log(worksheet[String.fromCharCode(65) + j])
                                    // console.log("실제 데이터가 있는 셀"+j);
                                    end = j;
                                    if (Flag == true){
                                        Flag = false;
                                        continue;
                                    }
                                    myArray.push(new Array(start,end - 1));
                                    start = end 
                                    section++;
                                }
                                
                                
                            }
                            var min = myArray[0][0];
                            var max = myArray[myArray.length-1][1];
                        
                            var nemu = new Array();

                            for (let i = 66; i <= 70; i++) {
                                var morning = new Array();
                                var lunch = new Array();
                                var Unity = new Array();
                                var Dinner = new Array();

                                for (let j = min  ; j <= max; j++) {
                                  
                                    if(worksheet[String.fromCharCode(i) + j]  == undefined ){ continue }

                                    if (myArray[0][0] <= j && myArray[0][1] > j){
                                        morning.push(worksheet[String.fromCharCode(i) + j].v)
                                    }

                                    if (myArray[1][0] <= j && myArray[1][1] > j){
                                        lunch.push(worksheet[String.fromCharCode(i) + j].v)
                                    }

                                    if (myArray[2][0] <= j && myArray[2][1] > j){
                                        Unity.push(worksheet[String.fromCharCode(i) + j].v)
                                    }

                                    if (myArray[3][0] <= j && myArray[3][1] > j){
                                        Dinner.push(worksheet[String.fromCharCode(i) + j].v)
                                    }
                                    
                                    
                                }// end frist for 
                                var toDatNemu = new Object();
                                    toDatNemu.data = getMenuDay(worksheet[String.fromCharCode(i) + 2].v);
                                    toDatNemu.Vacation = false
                                   
                                    toDatNemu.morning = morning
                                    toDatNemu.lunch = lunch
                                    toDatNemu.Unity = Unity
                                    toDatNemu.Dinner = Dinner
                                    
                                    nemu.push(toDatNemu);
                            }// end tow for  
                        }
                        var jsonInfo = JSON.stringify(nemu);
                        console.log(jsonInfo)  
                        res.end(jsonInfo);
                    });
                });
            });
        });
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))



function getMenuDay(daydata){

    var MM;
    var DD;
    var data = daydata;

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

    return  YY + "-" + MM + "-" + DD;
}

