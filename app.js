var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');


 var	fs       = require('fs'),
     http     = require('http'),
     util     = require('util'),
  	common    = require('common');
var app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
	lastPage: '',
	secret : '12345qwerty'
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));


var users = mongoose.model('users',{
	login : String, 
	password : String,
	email: String,
	username: String,
	birth: String,
	about: String
});
var articles = mongoose.model('articles', 
	{
		name: String, 
		title: String, 
		body: String, 
		author: String,
		comments: [{ 
			author: String, 
			comment: String, 
			create_at: String 
				  }],
		create_at : String 

	} );




app.get('/user_profile',function(req,res){
	console.log("login:");
	
	console.log(req.query.login);
	


	db = mongoose.connect('mongodb://localhost:27017/test');
    users.findOne({login: req.query.login},function(err,data){
        if (err) console.log(err);
        res.send(data);
        console.log(data);
    mongoose.connection.close();
    });



});


app.get('/articles',function(req,res) {
    db = mongoose.connect('mongodb://localhost:27017/test');
    articles.find({},function(err,data){
        if (err) console.log(err);
        res.send(data);
        console.log(data);
    mongoose.connection.close();
    });


});





app.get('/users',function(req,res) {
    db = mongoose.connect('mongodb://localhost:27017/test');
    users.find({},function(err,data){
        if (err) console.log(err);
        res.send(data);
    mongoose.connection.close();
    });


});


app.post('/login',function(req,res){
	console.log(req.body.login);
db = mongoose.connect('mongodb://localhost:27017/test');
	users.find({login: req.body.login,password: req.body.password},function(err,data){
        if (err) console.log(err);
        
        res.send(data);
        console.log(data);
    mongoose.connection.close();
    });
});



app.post('/delete_article',function(req,res){
console.log(req.body.article_name);
		db = mongoose.connect('mongodb://localhost:27017/test');
		articles.remove({name: req.body.article_name},function(err,data){
			if(err) console.log(err);
			console.log(data);
			

			
			mongoose.connection.close();
		});


});

app.post('/remove_comment',function(req,res){
	console.log(req.body.article_name);
	console.log(req.body.comment_text);
	db = mongoose.connect('mongodb://localhost:27017/test');
	articles.findOne({name: req.body.article_name},function(err,data){
        if (err) console.log(err);
        	/*
        	data.comments.push({
        		author: req.body.author, 
        		comment : req.body.comment, 
        		create_at: req.body.create_at
        					 });
        	*/
        	var i = 0;
        	data.comments.forEach(function(comm){
						if (comm.comment == req.body.comment_text){
							 	data.comments.splice(i,1);
								i=0;

							}
							i++;

							
						});



        	data.save();
        
    	mongoose.connection.close();
    });


});


app.post('/add_article',function(req,res){
	db = mongoose.connect('mongodb://localhost:27017/test');
	articles.create({
		name: req.body.name , 
		title: req.body.title,
		body: req.body.body,
		author: req.body.author,
		comments: [],
		create_at: req.body.create_at

					},function(err,data){
		if (err) res.send(err);
		
		 else	res.send('added');
		mongoose.connection.close(); 
	});

});



app.post('/add_comment',function(req,res){
			
			console.log(req.body.author);
			console.log(req.body.comment);
			console.log(req.body.create_at);
			console.log(req.body.article_name);

	db = mongoose.connect('mongodb://localhost:27017/test');
	articles.findOne({name: req.body.article_name},function(err,data){
        if (err) console.log(err);
        	data.comments.push({
        		author: req.body.author, 
        		comment : req.body.comment, 
        		create_at: req.body.create_at
        					 });
        	data.save();
        
    	mongoose.connection.close();
    });
});




app.post('/reg',function(req,res){

	console.log(req.body.birth);
	
	db = mongoose.connect('mongodb://localhost:27017/test');
	
	users.create({

	login: req.body.login , 
	password: req.body.password,
	email: req.body.email,
	username: req.body.username,
	birth: req.body.birth,
	about: req.body.about
	},function(err,data){
		if (err) res.send(err);
		 else	res.send('added');
		mongoose.connection.close(); 
	});
	
});




// view engine setup




module.exports = app;


