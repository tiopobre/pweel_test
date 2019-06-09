var express = require('express');
var router = express.Router();
///
var vacante_actual_id;
// models
var vacante = require('../models/vacante');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {
        title: 'PWEEL | Trabajo',
        style: 'style.css'
    });
});
/* Obtener pagina de trabajos. */
router.get('/trabajos', function (req, res, next) {
    vacante.find({}, function (err, docs) {
        chunk1 = [];
        chunk2 = [];
        for (var i = 0; i < docs.length; i++) {
            if (i % 2 == 0) {
                chunk1.push(docs[i]);
            }
            else {
                chunk2.push(docs[i]);
            }

        }
        vacantesCol1 = docs;
        res.render('trabajos', {
            title: 'Trabajos | PWEEL',
            style: 'style_trabajos.css',
            vacantes1: chunk1,
            vacantes2: chunk2,
        });
    });

});

/* Obtener pagina de vacantes. */
router.get('/vacantes', function (req, res, next) {
    vacante.find({}, function (err, docs) {
        chunk1 = [];
        chunk2 = [];
        for (var i = 0; i < docs.length; i++) {
            if (i % 2 == 0) {
                chunk1.push(docs[i]);
            }
            else {
                chunk2.push(docs[i]);
            }

        }
        vacantesCol1 = docs;
        res.render('vacantes', {
            title: 'Vacantes | PWEEL',
            style: 'style_vacantes.css',
            vacantes1: chunk1,
            vacantes2: chunk2,
            doctam: docs.length
        });
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
router.get('/confing_vacante', function (req, res, next) {
    res.render('confing_vacante', {
        title: vacante_actual_id,
        style: 'style_conf_vacante.css'
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

module.exports = router;