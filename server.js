var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./server/database/database');
var jwt = require('jsonwebtoken');

process.env.SECRET = "SUBSCRIBE TO TECHWARRIORZ ON YOUTUBE";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/client', express.static(__dirname + '/client'))

//Controllers
var userController = require('./server/controllers/user-controller');

//Routers
var secureUserRouter = require('./server/routes/user');
var securePostRouter = require('./server/routes/post');

app.use('/secure-api/user/', secureUserRouter);
app.use('/secure-api/post/', securePostRouter);

//Routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
})

app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.logIn);

db.sync().then(function(){
    app.listen(3000, function(){
        console.log("Listening to port " + 3000);
    })
})