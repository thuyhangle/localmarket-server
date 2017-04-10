var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	product_id : {type : Schema.Types.ObjectId, ref: 'Product'},
	buyer_id : {type : Schema.Types.ObjectId, ref: 'Buyer'}
});
module.exports = mongoose.model('Order', OrderSchema);