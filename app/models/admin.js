var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	name: String,
	password: String
});

module.exports = mongoose.model('Admin', adminSchema);