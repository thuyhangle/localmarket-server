var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	user_id: {type : Schema.Types.ObjectId, ref: 'User'},
	type_id: {type : Schema.Types.ObjectId, ref: 'Type'},
	name: String,
	desc: String,
	price: Number,
	image: {data: Buffer, contentType: String}
});

module.exports = mongoose.model('Product', productSchema);