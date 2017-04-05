
// call package
var express = require('express')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// configure app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// connect database
var dbURL = 'mongodb://admin:admin@ds035016.mlab.com:35016/locmak';
mongoose.connect(dbURL, function(err) {
    if (err) throw err;
    console.info('Connected to database');
});

// call model
var Buyer = require('./app/models/buyer');
var Seller = require('./app/models/seller');
var Admin = require('./app/models/admin');
var Product = require('./app/models/product');
var Post = require('./app/models/post');


// ROUTE
var router = express.Router();
app.use('/api', router);
//testing
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to Locmak api!' });	
});



// route with buyer

router.route('/buyers')

	//create a buyer
	.post(function(req, res){
		var buyer = new Buyer({
			name: req.body.name,
			password: req.body.password
		});

		buyer.save(function(err) {
			if(err) throw err;
			res.json({ message: 'Buyer created!'});
		});

	})

	//get all buyers
	.get(function(req, res) {
		Buyer.find(function(err, buyers){
			if (err) throw err;
			res.json(buyers);
		});
	});

//---------- buyer with id

router.route('/buyers/:id')
	
	//get buyer
	.get(function(req, res) {
		Buyer.findById(req.params.id, function(err, buyer) {
			if (err) throw err;
			res.json(buyer);
		});
	})

	//update buyer
	.put(function(req, res) {
		Buyer.findById(req.params.id, function(err, buyer) {
			if (err) throw err;

			buyer.name = req.body.name;
			buyer.password = req.body.password;
			buyer.save(function(err) {
				if (err) throw err;

				res.json({ message : 'Buyer undated!'});
			});
		});
	})

	//delete buyer
	.delete(function(req, res){
		Buyer.remove({
			_id : req.params.id
		}, function(err, buyer){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});

// app.get('/', function (req, res) {
// 	var buyer = new Buyer({
// 		name : "tung",
// 		password: "123",
// 	});
// 	buyer.save(function(err){
// 		if(err) throw err;
// 		res.send(buyer);
// 	});

// 	var seller = new Seller({
// 		name : "hang",
// 		password: "123",
// 	});

// 	seller.save(function(err){
// 		if(err) throw err;
// 		buyer.save(function(err){
// 			if(err) throw err;
// 			res.send(buyer);
// 		});	
// 	});
  
// });

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});