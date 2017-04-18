
// call package
var express = require('express')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var async = require("async");
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// configure app
require('./config/passport')(passport);


app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  resave: false,
  saveUninitialized: true
}))// session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(cookieParser()); // read cookies (needed for auth)
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
mongoose.connect(configDB.url, function(err) {
    if (err) throw err;
    console.info('Connected to database');
});

// call model
var User = require('./app/models/user');
var Type = require('./app/models/type');

var Admin = require('./app/models/admin');
var Product = require('./app/models/product');
var Post = require('./app/models/post');
var Order = require('./app/models/order');

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/api/login');
}
// ROUTE
var router = express.Router();
app.use('/api', router);
//testing
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to Locmak api!' });	
});

// ------------- ROUTE WITH AUTH
router.route('/login')

	// render the page and pass in any flash data if it exists
	.get(function(req, res) {
		res.render('login.ejs' , { message : req.flash('loginMessage') });
	})

	app.post('/login',passport.authenticate('local-login', {
		successRedirect : '/api/users', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


router.route('/signup')

	.get(function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	})

	app.post('/signup',passport.authenticate('local-signup', {
		successRedirect : '/api/login', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

router.route('/logout')
	
	.get(function(req, res) {
		req.logout();
		res.redirect('/api');
	});


// ------------- ROUTE WITH USER

router.route('/users')

	//create a user
	.post(function(req, res){
		var user = new User({
			email: req.body.email,
			password: req.body.password
		});

		user.save(function(err) {
			if(err) throw err;
			res.json({ message: 'User created!'});
		});

	})

	//get all users
	.get(isLoggedIn,function(req, res) {
		User.find(function(err, users){
			if (err) throw err;
			res.json(users);
		});
	});

//---------- user profile
router.route('/users/profile')
	
	//get user profile
	.get(isLoggedIn,function(req, res) {
		res.json(req.user);
	});

//---------- user with id

router.route('/users/:id')
	
	//get user
	.get(function(req, res) {
		User.findById(req.params.id, function(err, user) {
			if (err) throw err;
			res.json(user);
		});
	})

	//update user
	// .put(function(req, res) {
	// 	User.findById(req.params.id, function(err, user) {
	// 		if (err) throw err;

	// 		user.email = req.body.email;
	// 		user.password = req.body.password;

	// 		user.save(function(err) {
	// 			if (err) throw err;

	// 			res.json({ message : 'User updated!'});
	// 		});
	// 	});
	// })

	//delete user
	.delete(function(req, res){
		User.remove({_id : req.params.id}, function(err, user){
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

router.route('/types/:id')
	
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

//---------- product without id
router.route('/products')
	
	// User create product
	.post(isLoggedIn, function(req, res) {
		var product = new Product({
			user_id : req.user.id,
			type_id : req.body.type_id,
			name : req.body.name,
			desc : req.body.desc,
			price : req.body.price,
			image : req.body.image

		});
			

			product.save(function(err){
				if (err) throw err;
				res.json({ message : 'Product created!'});
			});
		})

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
		Product.findOne({_id : req.params.product_id}, function(err, product){
			if (err) throw err;
   			res.json(products);
   			
		});
	})

	//update product
	.put(function(req, res) {
		Product.findById(req.params.product_id, function(err, product) {
			if (err) throw err;

			product.type_id = req.body.type_id;
			product.name = req.body.name;
			product.desc = req.body.desc;
			product.price = req.body.price;
			product.image = req.body.image;
			
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


//---------- Product with user
router.route('/products/user/items')
	
	

	// User view all their product
	.get(isLoggedIn, function(req, res) {
		Product.find({ user_id : req.user.id },function(err, products){
			if (err) throw err;
			res.json(products);
		});
	});

	
// ------------- ROUTE WITH ORDER


// route with orders, user_id and product_id
router.route('/orders/:product_id')

	//create a order
	.post(isLoggedIn, function(req, res){
		var order = new Order({
			product_id: req.params.product_id,
			user_id: req.user.id
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


//---------- orders with user_id
router.route('/orders/user/items')

	// get all orders from a user
	.get(isLoggedIn, function(req, res) {
		Order.find({user_id : req.user.id}, function(err, orders) {
			if (err) throw err;
			res.json(orders);
		});
	})

	// remove all orders from a buyer
	.delete(isLoggedIn, function(req, res) {
		Order.remove({user_id : req.user.id}, function(err, orders) {
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



//---------- post with user_id
router.route('/posts/user/items')

	//get all post from a user

	.get(function(req, res) {
        var userPosts = [];
        Product.find({user_id : req.user.id}, function(err, products) {
            if (err) throw err;
            async.eachSeries(products, function(product, next){
                Post.find({product_id : product.id}, function(err, posts) {
                    if (err) next(err);
                    for (var j = 0; j < posts.length; j++) {
                        userPosts.push(posts[j]);
                    }
                    next(null);
                });
            }, function(err){
                if(err) throw err;
                res.send(userPosts);
            })
        });

    })



//---------------   PORT
app.listen(3000, function () {
  console.log('App listening on port 3000!')
});