var express = require('express');
const bcrypt = require('bcrypt');
var session = require('express-session');
var app = express();
var bodyParser= require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var ObjectID = require('mongodb').ObjectID;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.use(session({secret: 'session'}));


const MongoURL = 'mongodb://localhost:27017';
const dbName = 'cloudkard';
var db = null;

//restful APIs
app.get('/products',function(req,res){
	res.send({products:products});
});


var sess;
//registers a user
app.post('/login',function(req,res){
	//gets the user details
	var resp= res;
	var request= req;
	var email = req.body.email;
	var password = req.body.password;
	
	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);

	 	db.collection('user', function (err, collection) {
         collection.find({email:email}).toArray(function(err, users){
          var user = users[0];
          if (user!=null)
          {
          	bcrypt.compare(password,user.password, function(err,result) {
	  			if(result)
	  			{
	  				var fname=user.fname;
	  				var userId=user._id;
          			resp.send({response:"login_success",fname:fname,userId:userId});
	  			} 
	  			else
	  			{
	   				//wrong password
          			resp.send({response:"wrong password"});
	  			} 
			});
          }
          else
          {
          	//user does not exist
          	resp.send({response:"wrong email address"});
          }
        });   
    });
	});
});


//registers a user
app.post('/register',function(req,res){
	//gets the user details
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password;
	var user=null;
	//hashing the password
	bcrypt.hash(password, 10, function(err, hash) {
 		user={fname:fname,lname:lname,email:email,password:hash};
    });

	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);
	 	insertUser(db,user, function(){});
	 	res.send({response:"user_registered"});
	});
});


//adds card to the database
app.post('/addCard',function(req,res){
	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);
	 	insertStudentCard(db,req.body, function(){});
	 	res.send({response:"card_successfully_added"});
	});
});

//adds a student card to the database
app.get('/addCard/:userId',function(req,res){
	var userId = req.params.userId;
	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);
	 	db.collection('cards', function (err, collection) {
         collection.find({userId:userId}).toArray(function(err, cards){
         res.send({response:cards});
        });   
    });
	});
});

app.delete('/addCard/:id',function(req,resp){
	var id = req.params.id;
	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);
	 	db.collection('cards', function (err, collection) {
	 	console.log("inside");
         collection.remove( {"_id": ObjectID(id)},function(err, res){
         resp.send({response:"delete_successful"});
        });  
    });
	});
});

app.put('/addCard/:id',function(req,res){
	var resp=res;
	var id = req.params.id;
	MongoClient.connect(MongoURL, function(err,client){
  		db = client.db(dbName);
	 	db.collection('cards', function (err, collection) {
         collection.update( {"_id": ObjectID(id)},req.body, function(err, res){
          resp.send({response:"update_successful"});
        });  
    });
	});
});


const insertStudentCard = function(db,card,callback) 
{
  // Get the documents collection
  const collection = db.collection('cards');
  // Insert some documents
  collection.insert(card);
}



const insertUser = function(db,user,callback) 
{
  // Get the documents collection
  const collection = db.collection('user');
  // Insert some documents
  collection.insert(user);
}








//The Server is listening to port 3000
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
	console.log("Server listening on Port: "+PORT);
});