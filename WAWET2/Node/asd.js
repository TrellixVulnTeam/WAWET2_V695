var cheerio = require('cheerio');

var request = require('request');

var iconv = require('iconv-lite');

const qs = require('querystring');


const express = require('express');

const app = express();

app.get('/recipe', function (req, res) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    
    var requestOptions = { method: "GET" ,
            uri: "http://www.10000recipe.com/recipe/"+req.query.n ,
            headers: { "User-Agent": "Mozilla/5.0" } ,
            encoding: null 
        };
        request(requestOptions, function(error, response, body) {
            var strContents = new Buffer(body); 
            var data = iconv.decode(strContents, 'utf-8').toString()
            $ = cheerio.load(data);
            
            $('.view_step').find('.best_tit').remove()
            $('.view_step').find('.carousel slide').remove()

            var myArray = new Array();
            $('.view_step').children().each(function(i, result){
                
                var text = $(result).find('.media-body').text();
                var image = $(result).find('img').attr('src');
                if (text == ""){
                    return false;
                }
                var itme = new Object();
                itme.text = text
                itme.image = image
                myArray.push(itme);
            });


            var jsonInfo = JSON.stringify(myArray);
            res.end(jsonInfo);
            

        });
});
//===============================================================
//===============================================================
//===============================================================

app.get('/theme', function (req, res) {
////http://www.10000recipe.com/theme/view.html?theme=101016003
//http://172.30.1.49:3000/theme?url=101013006
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    var url = qs.escape(req.query.url);

    var requestOptions = { method: "GET" ,
    uri:  "http://www.10000recipe.com/theme/view.html?theme="+url,
    headers: { "User-Agent": "Mozilla/5.0" },
    encoding: "utf8" 
    };

    console.log(requestOptions.uri);
    request(requestOptions, function(error, response, body) {
        var strContents = new Buffer(body); 
        var data = iconv.decode(strContents, 'utf-8').toString();
        $ = cheerio.load(data);
        // theme_list  ->  thumbnail st2
        // img caption pad_t_15 caption_name

        var myArray = new Array();

        $('.theme_list').find('.thumbnail').each(function(i, result){
            var itme = new Object();
            itme.href = $(result).attr('href').substring(8);
            itme.img = $(result).find('img').attr('src');
            itme.writer =  $(result).find('.caption').find('.caption_name').text();
            $(result).find('.caption').find('.caption_name').remove();
            itme.title = $(result).find('.caption').text().trim();
            myArray.push(itme);
        });


        var jsonInfo = JSON.stringify(myArray);
        res.end(jsonInfo);
        

        
    });


});


//===============================================================
//===============================================================
//===============================================================
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    //http://www.10000recipe.com/theme/list.html


    var requestOptions = { method: "GET" ,
        uri:  "http://www.10000recipe.com/theme/list.html",
        headers: { "User-Agent": "Mozilla/5.0" },
        encoding: "utf8" 
    };

    request(requestOptions, function(error, response, body) {
        var strContents = new Buffer(body); 

        var data = iconv.decode(strContents, 'utf-8').toString();

        $ = cheerio.load(data);

        var myArray = new Array();
        $(".theme_list").find(".thumbnail").each(function(i, result){
            var itme = new Object();
            $(result).find('span').remove();
            var href = $(result).attr('href')
            href = href.substring(23);
            itme.href = href
            itme.title = $(result).find('.caption').text().trim()
            myArray.push(itme);

        });
        var jsonInfo = JSON.stringify(myArray);
        res.end(jsonInfo);
        
    });
});
//===============================================================
//===============================================================
//===============================================================
app.get('/category', function (req, res) {

    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    console.log(req.query.q);

    var url = "http://www.10000recipe.com/recipe/list.html?q="+qs.escape(req.query.q);

    console.log(url);
        var requestOptions = { method: "GET" ,
            uri:  url ,
            headers: { "User-Agent": "Mozilla/5.0" },
            encoding: null 
        };

        console.log(requestOptions.uri)

        request(requestOptions, function(error, response, body) {
             // 전달받은 결과를 EUC-KR로 디코딩하여 출력한다. 
             var strContents = new Buffer(body); 

            var data = iconv.decode(strContents, 'utf-8').toString()


             $ = cheerio.load(data);
             var myArray = new Array();
             $('#contents_area').find('.rcp_m_list2').find('.row').find('.col-xs-4').each(function(i, result){
                var itme = new Object();
                $('span').remove()
                itme.title = $(result).find('.caption').find('.ellipsis_title2').text();
                itme.image = $(result).find('img').attr('src');
                var str = $(result).find('a').attr('href');
                var url = str.substring(8)
                itme.url = url;
                myArray.push(itme);     
            });

            var jsonInfo = JSON.stringify(myArray);

            res.end(jsonInfo);
            
        });


});


app.listen(3000, () => console.log('Example app listening on port 3000!'))