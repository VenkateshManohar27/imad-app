var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config ={
    user : 'venkateshmanohar',
    database : 'venkateshmanohar',
    host: 'db.imad.hasura-app.io',
    port : '5432',
    password:'db-venkateshmanohar-52214'
};

var app = express();
app.use(morgan('combined'));

var articleObject ={
    articleOne:
    {
    title:'Article One | Venkatesh Manohar',
    heading:'Article One',
    date: '13 Aug, 2017',
    content:`<p>
                    This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.
                </p>
                <p>
                    This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.This is my first article.
                </p>`
        
    },
    articleTwo: {
    title:'Article Two | Venkatesh Manohar',
    heading:'Article Two',
    date: '13 Aug, 2017',
    content:`<p>
                This is my Second article
            </p>`
    },
    articleThree: {
    title:'Article Three | Venkatesh Manohar',
    heading:'Article Three',
    date: '13 Aug, 2017',
    content:`<p>
                This is my Third article.
            </p>`
    }
};

var createTemplate = function(data){
  var title = data.title;
  var heading = data.heading;
  var date = data.date;
  var content= data.content;
  var htmlTemplate =  `<html>
    <head>
        <meta name ="view-port" content="width=device-width, initial-scale=1"/>
        <title>
            ${title}
        </title>
        <link href="/ui/style.css" rel="stylesheet">
    </head>
    <body>
        <div class = "container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>
               ${heading}
            </h3>
            <div>
                ${date}
            </div>
            <div>
                ${content}
            </div>
        </div>
    </body>
</html> `; 
return htmlTemplate;
};

var pool = new Pool(config);
app.get('/test-db', function (req, res){
    pool.query('SELECT * FROM ARTICLE', function (err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    })
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter =0;

app.get('/counter',function (req, res){
    counter = counter + 1;
    res.send(counter.toString());
});

var nameList =[];
app.get('/submit-btn', function (req,res){
    var name = req.query.name;
    nameList.push(name);
    res.send(JSON.stringify(nameList));
});

app.get('/:articlepar', function(req,res){
    
    var articleObj = req.params.articlepar;
    res.send(createTemplate(articleObject[articleObj]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
