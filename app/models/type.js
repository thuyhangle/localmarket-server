var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
	name: String,
	desc: String
});

module.exports = mongoose.model('Type', typeSchema);