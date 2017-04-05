var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	product_id : {type : Schema.Types.ObjectId, ref: 'Product'},
	phone : Number,
	address : String,
	other : String
});
module.exports = mongoose.model('Post', postSchema);