var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var session = require('express-session');

var bodyParser = require('body-parser');
var config ={
    user : 'venkateshmanohar',
    database : 'venkateshmanohar',
    host: 'db.imad.hasura-app.io',
    port : '5432',
    password:'db-venkateshmanohar-52214'
};



var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'SomeRamdomSecret',
    cookie:{maxAge:1000*60*60*24*30}
}));
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
    });
});

function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    
    return ['pbkdf2Sync',salt,10000,hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res){
    
    var input = req.params.input;
    var hashInput = hash(input, 'this-is-a-random-string');
    res.send(hashInput);
});

app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO appuser (username, password) VALUES($1,$2)', [username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send('User  successfully created: '+ username);
        }
    });
    
});

app.post('/login', function(req,res){
   var username = req.body.username;
   console.log('username:'+username);
   var password = req.body.password;
   console.log('password:'+password);
   
   pool.query('SELECT id, username, password from appuser where username = $1', [username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            if(result.rows.length ===0){
                res.status(403).send('username/password is invalid');
            }else{
                var dbpwd = result.rows[0].password;
                var salt = dbpwd.split('$')[1];
                console.log('salt is:'+salt);
                var hashpwd = hash(password, salt);
                if(hashpwd === dbpwd){
                    
                    req.session.auth ={userId: result.rows[0].id};
                    console.log('UserId of the session created:'+req.session.auth.userId);
                    res.send('Credentials are valid');
                }else{
                    res.status(403).send('Credentials are invalid');
                }
                
            }
         
        }
    });
   
});

app.get('/logout', function (req,res){
    delete req.session.auth;
    res.send('Logged Out');
});

app.get('/check-login', function(req, res){
    console.log('Sesssion:'+req.session);
    if(req.session && req.session.auth && req.session.auth.userId){
        
        res.send('You are logged in : '+req.session.auth.userId.toString());
    }else{
        res.send('You are not logged in');
    }
    
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

app.get('/articles/:articlepar', function(req,res){
    
    var articleId = req.params.articlepar;
    pool.query('SELECT * FROM ARTICLE WHERE ID=$1',[articleId],  function(err, result){
         if(err){
            res.status(500).send(err.toString());
        } else {
            if(result.rows.length === 0){
                res.status(404).send('Article not found');
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
            
        }
    });
    
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
