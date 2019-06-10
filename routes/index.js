var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var vacante = require('../models/vacante');

var csrfProtection = csrf();
router.use(csrfProtection);

var vacante_actual_nombre = '';

var typeID = '';
var numID = '';
var email = '';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {
        title: 'PWEEL | Trabajo',
        style: 'style.css'
    });
});

/* Obtener pagina de trabajos. */
router.get('/trabajos', function (req, res, next) {
    // todas las vacantes

    vacante.find({}, function (err, docs) {
        var chunk1 = [];
        var chunk2 = [];
        for (var i = 0; i < docs.length; i++) {
            if (i % 2 == 0) {
                chunk1.push(docs[i]);
            } else {
                chunk2.push(docs[i]);
            }
        }
        json1 = {
            title: 'Trabajos | PWEEL',
            style: 'style_trabajos.css',
            vacantes1: chunk1,
            vacantes2: chunk2,
        }
        json = json1;
    });
    //render pag
    res.render('trabajos', { 
        title: 'Trabajos | PWEEL',
            style: 'style_trabajos.css',
            vacantes1: chunk1,
            vacantes2: chunk2,
    });
    //vacantes postuladas
});

/* Obtener pagina de vacantes. */
router.get('/vacantes', function (req, res, next) {
    vacante.find({}, function (err, docs) {
        chunk1 = [];
        chunk2 = [];
        for (var i = 0; i < docs.length; i++) {
            if (i % 2 == 0) {
                chunk1.push(docs[i]);
            } else {
                chunk2.push(docs[i]);
            }
        }

        res.render('vacantes', {
            title: 'Vacantes | PWEEL',
            style: 'style_vacantes.css',
            vacantes1: chunk1,
            vacantes2: chunk2,
            doctam: docs.length
        });
    });

});

router.post('/vacantes', function (req, res, next) {

    var vacante_actual_id = req.body.id_de_la_vacante;
    vacante_actual_nombre = req.body.nombre_de_la_vacante;
    console.log("------------------------> Entro al post de mierda!!! ====> " + vacante_actual_id);
    res.redirect('/confing_vacante/' + vacante_actual_id);
});

router.get('/crear_vacante', function (req, res, next) {
    res.render('crear_vacante', {
        title: 'PWELL | Crear vacante',
        style: 'style_conf_vacante.css',
        csrfToken: req.csrfToken()
    });
});

router.post('/crear_vacante', function (req, res, next) {
    console.log("--------Eoooo--------------------------------> " + email);

    User.findOne({
        'cuenta.email': email
    },
        function (err, user) {
            if (err) {
                console.log("--------------------------------> Fail: " + err);
            } else {
                console.log("--------------------------------> Usuario: " + user);
            }

            var newVacante = new vacante();
            newVacante.id_empleador = user._id;
            newVacante.Cargo = req.body.nombre;
            newVacante.Fecha_tar = req.body.fecha_form;
            newVacante.Lugar = req.body.lugar_form;
            newVacante.Tiempo = req.body.duracion_form;
            newVacante.pago = req.body.pagus;
            newVacante.num_vacantes = req.body.num_postulantes_form;
            newVacante.express = false;
            newVacante.descripcion = req.body.descripcion_vac;

            console.log("--------------------------------> Creo la vacante");

            newVacante.save(function (err, result) {
                if (err) {

                    console.log("--------------------------------> Fail: " + err);
                } else {
                    console.log("--------------------------------> Subio la vacante creoooo");
                }

            });
            console.log("--------------------------------> Subio la vacante: " + newVacante);

            user.cv.vacantes_propias.push(newVacante._id);
            user.save(function (err) {
                if (err) {
                    console.log("--------------------------------> Fail: " + err);
                    res.redirect('/');
                } else {
                    res.redirect('/user/cv');
                }
            });
            console.log("--------------------------------> Añadio la vacante a la lista del usuario");
        });
});

/* Obtener pagina de postulados. */
router.get('/postulados', function (req, res, next) {
    res.render('postulados', {
        title: 'PWEEL | Postulados',
        style: 'style_postulado.css'
    });
});

/* Obtener pagina de confing_vacante. */
router.get('/confing_vacante/:id', function (req, res, next) {
    var id = req.params.id;
    res.render('confing_vacante', {
        title: 'PWELL | Config vacante',
        style: 'style_conf_vacante.css',
        la_puta_id: id,
        nombre_cargo: vacante_actual_nombre
    });
});

/* Obtener pagina de confing_user. */
router.get('/confing_user', function (req, res, next) {
    res.render('confing_user', {
        title: 'PWEEL | confing_user',
        style: 'style_confing_user.css'
    });
});

router.get('/terminos_condiciones', function (req, res, next) {
    res.render('terminos_condiciones', {
        title: 'PWEEL | terminos_condiciones',
        style: 'style_terms.css'
    });
});



router.get('/user/cv', isLoggedIn, function (req, res, next) {
    res.render('user/cv', {
        title: 'PWEEL | Hoja de vida',
        style: 'style_cv.css',
        csrfToken: req.csrfToken()
    })
});

router.get('/user/logout', isLoggedIn, function (req, res, next) {
    typeID = '';
    numID = '';
    email = '';
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/user/iniciarsesion', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/iniciarsesion', {
        title: 'PWEEL | Iniciar sesión',
        style: 'style_inisec.css',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/user/iniciarsesion', passport.authenticate('local.singin'), function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    email = req.body.email.toString();
    res.redirect('/user/cv');
});


router.get('/user/registro1', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/registro1', {
        title: 'PWEEL | Registro',
        csrfToken: req.csrfToken(),
        style: 'style_reg.css',
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/user/registro1', function (req, res, next) {
    typeID = req.body.IDType;
    numID = req.body.IDNum.toString();
    email = req.body.email.toString();

    req.checkBody('email', 'El correo ingresado es invalido, como tu :v').notEmpty().isEmail();

    var errors = req.validationErrors();
    User.findOne({
        'cuenta.email': email
    }, function (err, user) {
        var messages = [];
        var hay_error = false;
        if (err) {
            messages.push(err);
        }
        if (user) {
            messages.push('El correo ya esta en uso.');
        }
        if (errors) {

            errors.forEach(function (error) {
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

router.get('/user/registro2', function (req, res, next) {
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


router.post('/user/registro2', passport.authenticate('local.signup2', {
    successRedirect: '/user/cv',
    failureRedirect: '/user/registro2',
    failureFlash: true

}));

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