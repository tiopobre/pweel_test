var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});

passport.use('local.signup2', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    console.log("-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- - > entro a autentificar");
    req.checkBody('email', 'El correo ingresado es invalido, como tu :v').notEmpty().isEmail();
    req.checkBody('password', 'La contraseña debe contar con al menos 3 caracteres').notEmpty().isLength({
        min: 3
    });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'cuenta.email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'El correo ya esta en uso.' })
        }
        var newUser = new User();
        newUser.cuenta.email = email;
        newUser.cuenta.password = newUser.encryptPassword(password);
        newUser.cv.porcent = 45;
        newUser.cv.inf.nombres = req.body.name;
        newUser.cv.inf.primer_apellido = req.body.lname1;
        newUser.cv.inf.segundo_apellido = req.body.lname2;
        newUser.cv.inf.tipo_doc = req.body.IDType;
        newUser.cv.inf.num_doc = req.body.IDNum;
        newUser.cv.inf.born_date.day = req.body.bday;
        newUser.cv.inf.born_date.month = req.body.bmonth;
        newUser.cv.inf.born_date.year = req.body.byear;
        newUser.cv.inf.cel = req.body.cel;
        newUser.cv.inf.tel = req.body.fijo;

        //Guardamos el usuario en la base de datos:
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        })
    })
}));

passport.use('local.singin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'El correo ingresado es invalido, como tu :v').notEmpty().isEmail();
    req.checkBody('password', 'La contraseña es invalida, como tu :v').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'cuenta.email': email
    }, function(err, user) {
        console.log("--------------------------------->" + user);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'Usuario no encontrado.'
            });
        }
        if (!user.validPassword(password)) {
            console.log("---------------------------------> Entro al validar la contraseña falsa");
            return done(null, false, {
                message: 'Contraseña invalida.'
            });
        }
        return done(null, user);
    });
}));