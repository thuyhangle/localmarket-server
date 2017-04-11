
// call package
var express = require('express')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

// configure app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// connect database
var dbURL = 'mongodb://admin:admin@ds035016.mlab.com:35016/locmak';
mongoose.connect(dbURL, function(err) {
    if (err) throw err;
    console.info('Connected to database');
});

// call model
var Buyer = require('./app/models/buyer');
var Type = require('./app/models/type');
var Seller = require('./app/models/seller');
var Admin = require('./app/models/admin');
var Product = require('./app/models/product');
var Post = require('./app/models/post');
var Order = require('./app/models/order');


// ROUTE
var router = express.Router();
app.use('/api', router);
//testing
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to Locmak api!' });	
});



// ------------- ROUTE WITH BUYER

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

				res.json({ message : 'Buyer updated!'});
			});
		});
	})

	//delete buyer
	.delete(function(req, res){
		Buyer.remove({_id : req.params.id}, function(err, buyer){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});





// ------------- ROUTE WITH SELLER

router.route('/sellers')

	//create a seller
	.post(function(req, res){
		var seller = new Seller({
			name: req.body.name,
			password: req.body.password
		});

		seller.save(function(err) {
			if(err) throw err;
			res.json({ message: 'Seller created!'});
		});

	})

	//get all sellers
	.get(function(req, res) {
		Seller.find(function(err, sellers){
			if (err) throw err;
			res.json(sellers);
		});
	});
	
//---------- seller with id

router.route('/sellers/:id')
	//get seller
	.get(function(req, res) {
		Seller.findById(req.params.id, function(err, seller) {
			if (err) throw err;
			res.json(seller);
		});
	})

	//update seller
	.put(function(req, res) {
		Seller.findById(req.params.id, function(err, seller) {
			if (err) throw err;

			seller.name = req.body.name;
			seller.password = req.body.password;

			seller.save(function(err) {
				if (err) throw err;

				res.json({ message : 'Seller updated!'});
			});
		});
	})

	//delete seller
	.delete(function(req, res){
		Seller.remove({_id : req.params.id}, function(err, seller){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});


// ------------- ROUTE WITH TYPE

router.route('/types')

	//create a type
	.post(function(req, res){
		var type = new Type({
			name: req.body.name,
			desc: req.body.desc
		});

		type.save(function(err) {
			if(err) throw err;
			res.json({ message: 'Type created!'});
		});

	})

	//get all types
	.get(function(req, res) {
		Type.find(function(err, types){
			if (err) throw err;
			res.json(types);
		});
	});

//---------- type with id

router.route('/type/:id')
	
	//get type
	.get(function(req, res) {
		Type.findById(req.params.id, function(err, type) {
			if (err) throw err;
			res.json(type);
		});
	})

	//update type
	.put(function(req, res) {
		Type.findById(req.params.id, function(err, type) {
			if (err) throw err;

			type.name = req.body.name;
			type.desc = req.body.desc;

			type.save(function(err) {
				if (err) throw err;

				res.json({ message : 'Type updated!'});
			});
		});
	})

	//delete type
	.delete(function(req, res){
		Type.remove({_id : req.params.id}, function(err, type){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});

// ------------- ROUTE WITH PRODUCT
var imgPath = "/img/Desert.jpg";

//---------- product without id
router.route('/products')
	
	// get all products
	.get(function(req, res) {
		Product.find(function(err, products){
			if (err) throw err;
   			res.json(products);
		});
	})

	// delete all products
	.delete(function(req, res) {
		Product.remove({}, function(err, products){
			if(err) throw err;

			res.json({ message: 'Deleted ALL!'});
		});
	})

//---------- product with type
router.route('/products/type/:type_id')

	// get all product with type
	.get(function(req, res) {
		Product.find({type_id : req.params.type_id} , function(err, products) {
			if (err) throw err;

			res.json(products);
		});
	})

	// delete all product with type
	.delete(function(req, res) {
		Product.remove({type_id : req.params.type_id} , function(err, products) {
			if (err) throw err;

			res.json({ message : 'Deleted!' });
		});
	})


//---------- product with Product_id
router.route('/products/:product_id')
	
	// get product with product_id
	.get(function(req, res) {
		Product.findById(req.params.product_id, function(err, product){
			if (err) throw err;
			res.contentType(product.image.contentType);
          	res.send(product.image.data);
   			// res.json(products);
   			
		});
	})

	//update product
	.put(function(req, res) {
		Product.findById(req.params.product_id, function(err, product) {
			if (err) throw err;

			product.type_id = req.body.type_id,
			product.name = req.body.name,
			product.desc = req.body.desc,
			product.price = req.body.price
			
			product.save(function(err) {
				if (err) throw err;

				res.json({ message : 'Product updated!'});
			});
		});
	})

	// delete product with product_id
	.delete(function(req, res){
		Product.remove({_id : req.params.product_id}, function(err, product){
			if (err) throw err;

			res.json({ message: 'Deleted!'});
		});
	})


//---------- Product with seller_id 
router.route('/products/:seller_id/items')
	
	// Seller create product
	.post(function(req, res) {
		var product = new Product({
			seller_id : req.params.seller_id,
			type_id : req.body.type_id,
			name : req.body.name,
			desc : req.body.desc,
			price : req.body.price
		});
			product.image.data = fs.readFileSync(imgPath);
			product.image.contentType = 'image/jpg';

			product.save(function(err){
				if (err) throw err;
				res.json({ message : 'Product created!'});
			});
		})

	// Seller view all their product
	.get(function(req, res) {
		Product.find({seller_id : req.params.seller_id},function(err, products){
			if (err) throw err;
			res.json(products);
		});
	});

	
// ------------- ROUTE WITH ORDER


// route with orders, buyer_id and product_id
router.route('/orders/:buyer_id/:product_id')

	//create a order
	.post(function(req, res){
		var order = new Order({
			product_id: req.params.product_id,
			buyer_id: req.params.buyer_id
		});

		order.save(function(err) {
			if(err) throw err;
			res.json({ message: 'Order created!'});
		});

	})

//----------route with /orders

router.route('/orders')

	//get all orders
	.get(function(req, res) {
		Order.find(function(err, orders){
			if (err) throw err;
			res.json(orders);
		});
	})

//---------- orders with id

router.route('/orders/:id')
	
	//get order
	.get(function(req, res) {
		Order.findById(req.params.id, function(err, order) {
			if (err) throw err;
			res.json(order);
		});
	})

	//delete order
	.delete(function(req, res){
		Order.remove({_id : req.params.id}, function(err, order){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});


//---------- orders with buyer_id
router.route('/orders/buyer/:buyer_id')

	// get all orders from a buyer
	.get(function(req, res) {
		Order.find({buyer_id : req.params.buyer_id}, function(err, orders) {
			if (err) throw err;
			res.json(orders);
		});
	})

	// remove all orders from a buyer
	.delete(function(req, res) {
		Order.remove({buyer_id : req.params.buyer_id}, function(err, orders) {
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	})


//---------- orders with product_id
router.route('/orders/product/:product_id')

	// get all orders from a product
	.get(function(req, res) {
		Order.find({product_id : req.params.product_id}, function(err, orders) {
			if (err) throw err;
			res.json(orders);
		});
	})

	// remove all orders from a product
	.delete(function(req, res) {
		Order.remove({product_id : req.params.product_id}, function(err, orders) {
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	})


// ------------- ROUTE WITH POST

//---------- post with product_id
router.route('/posts/product/:product_id')

	//create a post
	.post(function(req, res){
		var post = new Post({
			product_id: req.params.product_id,
			phone: req.body.phone,
			address: req.body.address,
			other: req.body.other
		});

		post.save(function(err) {
			if(err) throw err;
			res.json({ message: 'Post created!'});
		});

	})

	//get all post from a product
	.get(function(req, res) {
		Post.find({product_id : req.params.product_id}, function(err, posts) {
			if (err) throw err;
			res.json(posts);
		});
	})

	// delete all post from a product
	.delete(function(req, res) {
		Post.remove({product_id : req.params.product_id}, function(err, posts) {
			if (err) throw err;

			res.json({message : 'Deleted!'})
		});
	});

//---------- route /posts
router.route('/posts')

	//get all posts
	.get(function(req, res) {
		Post.find(function(err, posts){
			if (err) throw err;
			res.json(posts);
		});
	})

	.delete(function(req, res) {
		Post.remove(function(err, posts) {
			if (err) throw err;

			res.json({message : 'DELETE ALL!'})
		});
	})

//---------- post with id

router.route('/posts/:id')
	
	//get a post
	.get(function(req, res) {
		Post.findById(req.params.id, function(err, post) {
			if (err) throw err;
			res.json(post);
		});
	})

	//update post
	.put(function(req, res) {
		Post.findById(req.params.id, function(err, post) {
			if (err) throw err;

			post.phone = req.body.phone;
			post.address = req.body.address;
			post.other = req.body.other;

			post.save(function(err) {
				if (err) throw err;

				res.json({ message : 'Post updated!'});
			});
		});
	})

	//delete a post
	.delete(function(req, res){
		Post.remove({_id : req.params.id}, function(err, post){
			if (err) throw err;

			res.json({ message: 'Deleted!'})
		});
	});



//---------- post with seller_id
router.route('/posts/seller/:seller_id')

	//get all post from a seller

	.get(function(req, res) {
		var sellerPosts = [];
		Product.find({seller_id : req.params.seller_id}, function(err, products) {
			if (err) throw err;
			for (var i = 0; i < products.length; i++) {
				console.log("id", products[i].id);
				Post.find({product_id : products[i].id}, function(err, posts) {
					if (err) throw err;
					for (var j = 0; j < posts.length; j++) {
						sellerPosts.push(posts[j]);
						console.log("in find",sellerPosts);

					}
				});
				console.log(sellerPosts);
			}
			console.log("test", sellerPosts);
			var sss = "sss";
			console.log("tesssst", sss);
			res.send(sss);
		});

	})



//---------------   PORT
app.listen(3000, function () {
  console.log('App listening on port 3000!')
});