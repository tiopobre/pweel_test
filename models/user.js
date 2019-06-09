var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    cuenta: [{
        email: { type: String, required: true },
        password: { type: String, required: true },
        second_email: { type: String, required: false },
        preferencias: [{
            recivir_correos: { type: Boolean, required: false },
            subs_msg: { type: Boolean, required: false },
            noticias: { type: Boolean, required: false }
        }]
    }],
    cv: [{
        porcent: { type: Number, required: true },
        inf: [{
            nombres: { type: String, required: true },
            primer_apellido: { type: String, required: true },
            segundo_apellido: { type: String, required: true },
            tipo_doc: { type: Number, required: true },
            num_doc: { type: Number, required: true },
            born_date: { type: Date, required: true },
            genero: { type: Boolean, required: false },
            ciudad: { type: String, required: false },
            direccion: { type: String, required: false },
            born_city: { type: String, required: false },
            cel: { type: Number, required: true },
            tel: { type: Number, required: true }
        }],
        perfil_laboral: [{
            descripcion: { type: Number, required: false },
            exp_years: { type: Number, required: false },
            cargos: { type: Array, required: false }
        }]
    }]
});

module.exports = mongoose.model('User', userSchema);