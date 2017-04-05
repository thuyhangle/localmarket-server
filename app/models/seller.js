var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sellerSchema = new Schema({
    name:  String,
   	password: String
});

module.exports = mongoose.model('Seller', sellerSchema);