var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	seller_id: {type : Schema.Types.ObjectId, ref: 'Seller'},
	type: String,
	name: String,
	desc: String,
	price: Number,
	image: {data: Buffer, contentType: String}
});

module.exports = mongoose.model('Product', productSchema);