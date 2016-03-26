var MongoClient = require('mongodb').MongoClient;
// TODO load endpoint from config

MongoClient.connect("mongodb://localhost:8667/chess", function(err, db) {
  
	if(err) { return console.dir(err); }

	games = db.createCollection('games', {strict:true}, function(err, collection) {});
	games.insert();
});

