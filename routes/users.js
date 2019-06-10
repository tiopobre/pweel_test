var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var vacante = require('../models/vacante');

var csrfProtection = csrf();
router.use(csrfProtection);

var typeID = '';
var numID = '';
var email = '';

router.get('/cv', isLoggedIn, function(req, res, next) {
    res.render('user/cv', {
        title: 'PWEEL | Hoja de vida',
        style: 'style_cv.css',
        csrfToken: req.csrfToken()
    })
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    typeID = '';
    numID = '';
    email = '';
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/iniciarsesion', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/iniciarsesion', {
        title: 'PWEEL | Iniciar sesión',
        style: 'style_inisec.css',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/iniciarsesion', passport.authenticate('local.singin', {
    successRedirect: '/user/cv',
    failureRedirect: '/user/iniciarsesion',
    failureFlash: true
}));


router.get('/registro1', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/registro1', {
        title: 'PWEEL | Registro',
        csrfToken: req.csrfToken(),
        style: 'style_reg.css',
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/registro1', function(req, res, next) {
    typeID = req.body.IDType;
    numID = req.body.IDNum.toString();
    email = req.body.email.toString();

    req.checkBody('email', 'El correo ingresado es invalido, como tu :v').notEmpty().isEmail();

    var errors = req.validationErrors();
    User.findOne({
        'cuenta.email': email
    }, function(err, user) {
        var messages = [];
        var hay_error = false;
        if (err) {
            messages.push(err);
        }
        if (user) {
            messages.push('El correo ya esta en uso.');
        }
        if (errors) {

            errors.forEach(function(error) {
                messages.push(error.msg);
            });

        }
        if (hay_error) {
            req.flash('error', messages);
        } else {
            res.redirect('/user/registro2');
        }
    });
});

router.get('/registro2', function(req, res, next) {
    var messages = req.flash('error');
    console.log("numMSG: --------------------------->" + messages.length);
    res.render('user/registro2', {
        title: 'PWEEL | Registro',
        gtypeID: typeID,
        gnumID: numID,
        gemail: email,
        style: 'style_reg2.css',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    })
});


router.post('/registro2', passport.authenticate('local.signup2', {
    successRedirect: '/user/cv',
    failureRedirect: '/user/registro2',
    failureFlash: true

}));

router.post('/crear_vacante', function(req, res, next) {
    console.log("----------------------------------------> " + email);
    User.findOne({
            'cuenta.email': email
        },
        function(err, user) {
            var newVacante = new vacante();
            newVacante.id_empleador = user._id;
            newVacante.Cargo = req.body.nombre;
            newVacante.Fecha_tar = req.body.fecha_form;
            newVacante.Lugar = req.body.lugar_form;
            newVacante.Tiempo = req.body.duracion_form;
            newVacante.pago = req.body.pagus;
            newVacante.num_vacantes = req.body.num_postulantes_form;
            newVacante.express = req.body.express;
            newVacante.descripcion = req.body.descripcion_vac;

            console.log("--------------------------------> Creo la vacante");

            newVacante.save(function(err, result) {
                if (err) {}
                res.redirect('/user/cv');
            })
            console.log("--------------------------------> Subio la vacante");
            user.cv.vacantes_propias.push(newVacante._id);
            user.save(done);
            console.log("--------------------------------> Añadio la vacante a la lista del usuario");
        })
});

//protección (Middlewares):
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = router;