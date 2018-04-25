var express = require('express');
var bodyParser= require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');





//creates an express app
var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'cloudkard';
var db = null;

/*const insertUser = function(db, callback) 
{
  // Get the documents collection
  const collection = db.collection('user');

  // Insert some documents
  collection.insert({name:"Alieu",id:"10972018"});
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = client.db(dbName);
  insertUser(db, function() 
  {
     //client.close();
  });
});*/

app.get('/card', function (req, res) 
{
  //res.sendFile('/users/Arlboy/Desktop/kloucCard/view/' + '/index.html');
   res.send('login')
});

/*app.post('/login', function (req, res) 
{
 res.send('login')
});*/

// Connect to the db



/*app.post('/login', function (req, res) {
	 db.collection('users').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)

	res.json({msg: result});
    console.log('saved to database');
	});
});

app.get('/login', function (req, res) {
	db.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
    //db.close();
  });
});

app.put('/card', function (req, res) {
	res.json({card: "this is your first node js application"});
});

app.delete('/card', function (req, res) {
	res.json({card: "this is your first node js application"});
});*/

app.listen(3000);