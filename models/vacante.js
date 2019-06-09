var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VacanateSchema = new Schema({
    Cargo: String,
    Fecha_pub: String,
    Fecha_tar: String,
    Lugar: String,
    Tiempo: Number,
    pago: Number
}, {collection: 'vacantes'});

//model
module.exports = mongoose.model('Vacante', VacanateSchema);