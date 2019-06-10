var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    cuenta: {
        email: { type: String, required: true },
        password: { type: String, required: true },
        second_email: { type: String, required: false },
        preferencias: {
            recivir_correos: { type: Boolean, required: false },
            subs_msg: { type: Boolean, required: false },
            noticias: { type: Boolean, required: false }
        }
    },
    cv: {
        vacantes_propias: [Schema.Types.ObjectId],
        vacantes_presentadas: [Schema.Types.ObjectId],
        porcent: { type: Number, required: true },
        inf: {
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
            tel: { type: Number, required: true }
        },
        perfil_laboral: { type: Number, required: false }
    }
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.cuenta.password);
}

module.exports = mongoose.model('User', userSchema);