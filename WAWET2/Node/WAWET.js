var cheerio = require('cheerio');
var request = require('request');
// var url = require('url');

////
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
const download = require('download');

app.get('/recipe', function (req, res) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    var n = req.param('n');

    var url = "http://www.10000recipe.com/recipe/"+n;
    download(url).then(data => {
        $ = cheerio.load(data);
        res.end($(".view_step").html());

        

    });
});
//---------------------------------------------------------------------------------
app.get('/category', function (req, res) {
//http://192.168.0.16:3000/category?p=%EA%B2%A8%EC%9A%B8
//http://192.168.0.16:3000/category?p=겨울
   
//    console.log(categorys);
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    // var categorys = req.param('p');
    // req.query.get
    var temp = 'http://www.10000recipe.com/recipe/list.html?q='+req.query.p;

    


    console.log(temp);

    


    download(temp).then(data => {

       var Data = data

       $ = cheerio.load(data);
       var toDatNemu = new Object();
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



/*
<div class="col-xs-4">
    <a class="thumbnail" href="/recipe/6885993">
        <span class="thumbnail_over">
            <img src="http://recipe.ezmember.co.kr/img/thumb_over.png">
        </span>

        <img src="http://recipe.ezmember.co.kr/cache/recipe/2018/03/23/93806f9e22f7b5424d0ba80b3eeb45771_m.jpg" style="width:275px; height:275px;">

        <div class="caption">
            <h4 class="ellipsis_title2">【맛보장 완전 쉬운】얼갈이 물김치 담그기~</h4>
            <p>by 조밍키♥</p>
        </div>
    </a>

    <div style="position:absolute;top:365px;width:100%;text-align:right;right:20px;">
        <span style="color:#74b243;font-size:10px;" class="glyphicon glyphicon-certificate">
        </span>
    </div>

</div>



    <span class="thumbnail_over"><img src="http://recipe.ezmember.co.kr/img/thumb_over.png"></span>
            <img src="http://recipe.ezmember.co.kr/cache/recipe/2018/01/15/98d135a7f917b667d243a043530f51dd1_m.jpg" style="width:275px; height:275px;">
          <div class="caption">
                <h4 class="ellipsis_title2">&#xC2E4;&#xD328; &#xC5C6;&#xB294; &#xB099;&#xC9C0;&#xBCF6;&#xC74C; &#xB808;&#xC2DC;&#xD53C;, &#xB9E4;&#xCF64;&#xD55C; &#xC774; &#xB9DB;!</h4>
                <p>by &#xBCA0;&#xB9AC;&#xCE04;</p>
          </div>
*/