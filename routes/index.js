var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var vacante = require('../models/vacante');


var vacante_actual_nombre = '';

var typeID = '';
var numID = '';
var email = '';

var ista_ids = [];
var tam_ista_ids;
var id_user;
var id_v0;
var Uname;
var Vname;

router.get('/user/modo', function(req, res, next) {
    res.render('user/modo', {
        title: 'PWEEL | Modo',
        style: 'style_modo.css'
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'PWEEL | Trabajo',
        style: 'style.css'
    });
});

/* Obtener pagina de trabajos. */
router.get('/trabajos', function(req, res, next) {
    var V_pos1 = [];
    var V_pos2 = [];
    var T_chunk1 = [];
    var T_chunk2 = [];
    var V_aceptadas1 =[];
    var V_aceptadas2 =[];

    // todas las vacantes
    vacante.find({}, function(err, docs) {

        for (var i = 0; i < docs.length; i++) {
            if (i % 2 == 0) {
                T_chunk1.push(docs[i]);
            } else {
                T_chunk2.push(docs[i]);
            }
        }
        User.findOne({'cuenta.email': email}, function(err, user) {
            if (err) {
                console.log("--------------->ERROR");
            } else {
                var V_pos = user.cv.vacantes_presentadas;
                for (var i = 0; i < V_pos.length; i++) {
                    if (i % 2 == 0) {
                        if(V_pos[i].estado == 0){
                            V_pos1.push(V_pos[i]);
                        }else{
                            V_aceptadas1.push(V_pos[i]);
                        }                        
                    } else {
                        if(V_pos[i].estado == 0){
                            V_pos2.push(V_pos[i]);
                        }else{
                            V_aceptadas2.push(V_pos[i]);
                        } 
                    }
                }
                //render pag
                res.render('trabajos', {
                    title: 'Trabajos | PWEEL',
                    style: 'style_trabajos.css',
                    vacantes1: T_chunk1,
                    vacantes2: T_chunk2,
                    vacantes_pos1: V_pos1,
                    vacantes_pos2: V_pos2,
                    Aaptadas1 : V_aceptadas1,
                    Aaptadas1 : V_aceptadas2
                });
            }
        });
    });
});

router.post('/trabajos', function(req, res, next) {
    console.log("--------------------------------> Entro a esta mierdaaaaaaaa ");
    var id_vacante = req.body.thisid;
    res.redirect('/ver_vacante/' + id_vacante);
});

router.get('/ver_vacante/:id', function(req, res, next) {
    var id_vacante = req.params.id;
    vacante.findOne({
        '_id': id_vacante
    }, function(err, esta_vacante) {
        if (err) {
            console.log("--------------------------------> Fail: " + err);
        } else {
            console.log("--------------------------------> Usuario: " + esta_vacante);
            res.render('ver_vacante', {
                title: 'Trabajos | PWEEL',
                style: 'style_trabajos.css',
                id: esta_vacante._id,
                Cargo: esta_vacante.Cargo,
                Lugar: esta_vacante.Lugar,
                Fecha_pub: esta_vacante.Fecha_pub,
                descripcion: esta_vacante.descripcion,
                Tiempo: esta_vacante.Tiempo
            });
        }
    });
});

router.post('/ver_vacante', function(req, res, next) {
    console.log("--------Email--------------------------------> " + email);
    var id_vacante = req.body.thisid;
    vacante.findOne({
        '_id': id_vacante
    }, function(err, esta_vacante) {
        if (err) {
            console.log("--------------------------------> Fail: " + err);
        } else {
            console.log("--------------------------------> Usuario: " + esta_vacante);
        }
        User.findOne({
            'cuenta.email': email
        }, function(err, user) {
            if (err) {
                console.log("--------------------------------> Fail: " + err);
            } else {
                console.log("--------------------------------> Usuario: " + user);
            }
            var newPresentacion = {
                id: id_vacante,
                Cargo: esta_vacante.Cargo,
                Fecha_pub: esta_vacante.Fecha_pub,
                Fecha_tar: esta_vacante.Fecha_tar,
                Lugar: esta_vacante.Lugar,
                Tiempo: esta_vacante.Tiempo,
                pago: esta_vacante.pago,
                descripcion: esta_vacante.descripcion,
                estado: 0
            }
            user.cv.vacantes_presentadas.push(newPresentacion);
            user.save(function(err) {
                if (err) {
                    console.log("--------------------------------> Fail: " + err);
                    res.redirect('/');
                } else {
                    var newBebe = {
                        id: user._id,
                        nombres: user.cv.inf.nombres,
                        primer_apellido: user.cv.inf.primer_apellido,
                        segundo_apellido: user.cv.inf.segundo_apellido,
                        tipo_doc: user.cv.inf.tipo_doc,
                        num_doc: user.cv.inf.num_doc,
                        born_date: {
                            day: user.cv.inf.born_date.day,
                            month: user.cv.inf.born_date.month,
                            year: user.cv.inf.born_date.year
                        },
                        genero: user.cv.inf.genero,
                        ciudad: user.cv.inf.ciudad,
                        direccion: user.cv.inf.direccion,
                        born_city: user.cv.inf.born_city,
                        cel: user.cv.inf.cel,
                        tel: user.cv.inf.tel,
                        perfil_laboral: user.cv.perfil_laboral,
                        email: user.cuenta.email,
                        aceptado: false
                    }
                    esta_vacante.postulados.push(newBebe);
                    esta_vacante.save(function(err) {
                        if (err) {
                            console.log("--------------------------------> Fail: " + err);
                            res.redirect('/');
                        } else {
                            res.redirect('/trabajos');
                        }
                    });
                }
            });
        })
    })
});

/* Obtener pagina de vacantes. */
router.get('/vacantes', function(req, res, next) {

    //vacantes propias

    User.findOne({
        'cuenta.email': email
    }, function(err, user) {

        if (err) {
            console.log("--------------------------------> Fail: " + err);
        } else {
            console.log("--------------------------------> Usuario encontrado ");
        }
        id_user = user._id;
        Uname = user.cv.inf.nombres;
        tam_ista_ids = user.cv.vacantes_propias.length;
        var j = tam_ista_ids - 1;
        console.log("--------------------------------> Usuario.id: " + id_user);
        console.log("--------------------------------> Usuario.nombre: " + Uname);
        console.log("--------------------------------> Usuario.num_vacantes_propias: " + tam_ista_ids);
        vacante.find({
            id_empleador: id_user
        }, function(err, users) {
            if (err) {
                console.error('not found : ' + err);
            } else {
                var V_prop1 = [];
                var V_prop2 = [];
                console.log("--------------------------------> ID: " + id_user);
                console.log("--------------------------------> NUM: " + users.length);
                for (var i = 0; i < users.length; i++) {
                    if (i % 2 == 0) {
                        V_prop1.push(users[i]);
                    } else {
                        V_prop2.push(users[i]);
                    }
                }

                res.render('vacantes', {
                    title: 'Vacantes | PWEEL',
                    style: 'style_vacantes.css',
                    vacantes_prop1: V_prop1,
                    vacantes_prop2: V_prop2
                });
            }
        });

    });



});

router.post('/vacantes', function(req, res, next) {

    var vacante_actual_id = req.body.id_de_la_vacante;
    vacante_actual_nombre = req.body.nombre_de_la_vacante;
    console.log("------------------------> Entro al post de mierda!!! ====> " + vacante_actual_id);
    res.redirect('/confing_vacante/' + vacante_actual_id);
});

router.post('/vacantes_to_postulados', function(req, res, next) {

    var vacante_actual_id = req.body.id_de_la_vacante;
    console.log("------------------------> Entro al post de mierda!!! ====> " + vacante_actual_id);
    res.redirect('/postulados/' + vacante_actual_id);
});

router.get('/crear_vacante', function(req, res, next) {
    res.render('crear_vacante', {
        title: 'PWELL | Crear vacante',
        style: 'style_conf_vacante.css'
    });
});

router.post('/crear_vacante', function(req, res, next) {
    console.log("--------Email--------------------------------> " + email);

    User.findOne({
            'cuenta.email': email
        },
        function(err, user) {
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

            newVacante.save(function(err, result) {
                if (err) {

                    console.log("--------------------------------> Fail: " + err);
                } else {
                    console.log("--------------------------------> Subio la vacante creoooo");
                }

            });
            console.log("--------------------------------> Subio la vacante: " + newVacante);

            user.cv.vacantes_propias.push(newVacante._id);
            user.save(function(err) {
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

/* Obtener pagina de confing_vacante. */
router.get('/confing_vacante/:id', function(req, res, next) {
    var id = req.params.id;
    res.render('confing_vacante', {
        title: 'PWELL | Config vacante',
        style: 'style_conf_vacante.css',
        la_puta_id: id,
        nombre_cargo: vacante_actual_nombre
    });
});
/* Obtener pagina de postulados. */
router.get('/postulados/:id', function(req, res, next) {
    var id = req.params.id;
    vacante.findOne({ '_id': id }, function(err, esta_vacante) {
        if (err) {
            console.log("------------------->Error fatal");
        } else {
            var postulados = esta_vacante.postulados;
            res.render('postulados', {
                title: 'PWELL | postulados',
                style: 'style_postulado.css',
                postulados: postulados
            });
        }
    })

});

/* Obtener pagina de confing_user. */
router.get('/confing_user', function(req, res, next) {
    res.render('confing_user', {
        title: 'PWEEL | confing_user',
        style: 'style_confing_user.css'
    });
});

router.get('/terminos_condiciones', function(req, res, next) {
    res.render('terminos_condiciones', {
        title: 'PWEEL | terminos_condiciones',
        style: 'style_terms.css'
    });
});



router.get('/user/cv', isLoggedIn, function(req, res, next) {
    User.findOne({
        'cuenta.email': email
    }, function(err, user) {
        if (err) {
            console.log("--------------------------------> Fail: " + err);
        } else {
            console.log("--------------------------------> si encontro al Usuario");
            res.render('user/cv', {
                title: 'PWEEL | Hoja de vida',
                style: 'style_cv.css',
                percent: user.cv.porcent,
                nombres: user.cv.inf.nombres,
                primer_apellido: user.cv.inf.primer_apellido,
                segundo_apellido: user.cv.inf.segundo_apellido,
                cel: user.cv.inf.cel,
                cedula: user.cv.inf.num_doc,
                dia: user.cv.inf.born_date.day,
                ano: user.cv.inf.born_date.year,
                ciudad: user.cv.inf.ciudad,
                direccion: user.cv.inf.direccion,
                bcity: user.cv.inf.born_city,
                tel: user.cv.inf.tel,
                correo: user.cuenta.email
            });
        }
    });
});

router.get('/user/logout', isLoggedIn, function(req, res, next) {
    typeID = '';
    numID = '';
    email = '';
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/user/iniciarsesion', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/iniciarsesion', {
        title: 'PWEEL | Iniciar sesión',
        style: 'style_inisec.css',
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/user/iniciarsesion', passport.authenticate('local.singin'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    email = req.body.email.toString();
    res.redirect('/user/modo');
});

router.get('/user/registro1', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/registro1', {
        title: 'PWEEL | Registro',
        style: 'style_reg.css',
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/user/registro1', function(req, res, next) {
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

router.get('/user/registro2', function(req, res, next) {
    var messages = req.flash('error');
    console.log("numMSG: --------------------------->" + messages.length);
    res.render('user/registro2', {
        title: 'PWEEL | Registro',
        gtypeID: typeID,
        gnumID: numID,
        gemail: email,
        style: 'style_reg2.css',
        messages: messages,
        hasErrors: messages.length > 0
    })
});


router.post('/user/registro2', passport.authenticate('local.signup2', {
    successRedirect: '/user/modo',
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