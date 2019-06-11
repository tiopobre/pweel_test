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
        nombres: { type: String, required: true },
        primer_apellido: { type: String, required: true },
        segundo_apellido: { type: String, required: true },
        tipo_doc: { type: String, required: true },
        num_doc: { type: Number, required: true },
        born_date: {
            day: { type: Number, required: true },
            month: { type: String, required: true },
            year: { type: Number, required: true }
        },
        genero: { type: Boolean, required: false },
        ciudad: { type: String, required: false },
        direccion: { type: String, required: false },
        born_city: { type: String, required: false },
        cel: { type: Number, required: true },
        tel: { type: Number, required: true },
        perfil_laboral: { type: String, required: false },
        email: { type: String, required: true },
        full: Boolean,
        aceptado: Boolean
    }]
}, { collection: 'vacantes' });

//model
module.exports = mongoose.model('Vacante', VacanateSchema);