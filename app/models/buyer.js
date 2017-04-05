var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buyerSchema = new Schema({
    name:  String,
   	password: String
});

module.exports = mongoose.model('Buyer', buyerSchema);