var express = require('express')
var app = express();
var mongoose = require('mongoose');
var dbURL = 'mongodb://admin:admin@ds035016.mlab.com:35016/locmak';
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(dbURL, function(err) {
    if (err) throw err;
    console.info('Connected to database');
});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buyerSchema = new Schema({
    name:  String,
   	password: String
});
var Buyer = mongoose.model('Buyer', buyerSchema);

var sellerSchema = new Schema({
    name:  String,
   	password: String
});
var Seller = mongoose.model('Seller', sellerSchema);



app.get('/', function (req, res) {
	var buyer = new Buyer({
		name : "tung",
		password: "123",
	});
	buyer.save(function(err){
		if(err) throw err;
		res.send(buyer);
	});

	var seller = new Seller({
		name : "hang",
		password: "123",
	});

	seller.save(function(err){
		if(err) throw err;
		buyer.save(function(err){
			if(err) throw err;
			res.send(buyer);
		});	
	});
  
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});