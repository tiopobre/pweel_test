var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VacanateSchema = new Schema({
    id_empleador: Schema.Types.ObjectId,
    Cargo: String,
    Fecha_pub: String,
    Fecha_tar: Date,
    Lugar: String,
    Tiempo: Number,
    pago: Number,
    num_vacantes: Number,
    express: Boolean,
    descripcion: String,
    postulados: [{
        id: Schema.Types.ObjectId,
        nombre: String,
        aceptado: Boolean
    }]
}, { collection: 'vacantes' });

//model
module.exports = mongoose.model('Vacante', VacanateSchema);