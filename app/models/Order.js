var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	product_id : {type : Schema.Types.ObjectId, ref: 'Product'},
	user_id : {type : Schema.Types.ObjectId, ref: 'User'}
});
module.exports = mongoose.model('Order', orderSchema);