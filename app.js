var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');


// A SAVOIR render will automatically look in the views folder
// MES PAGES - fait model + controlleur. Posibilité de les séparer. A faire plus tard.

/* SESSIONS : On utilise les sessions */
app.use(session({secret: 'albumtopsecret'}))
// session album
app.use(function(req, res, next){
  if (typeof(req.session.albumlist) == 'undefined') {
    req.session.albumlist = [];
  }
  next();
})



// HOME PAGE
app.get('/', function (req, res) {
  res.render('pages/home.ejs', {albumlist: req.session.albumlist});
});

// ABOUT PAGE
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// ALBUM PAGE
/* Afficher l'album et les photos */
app.get('/album', function (req, res) {
  res.render('pages/album.ejs', {albumlist: req.session.albumlist});
})
// Ajouter "photos" - pour le moment du texte
app.post('/album/ajouter/', urlencodedParser, function(req, res) {
  if (req.body.newalbumphoto != '') {
    req.session.albumlist.push(req.body.newalbumphoto);
  }
  res.redirect('/album');
})
// supprimer photo (pour le moment du texte)
app.get('/album/supprimer/:id', function(req, res) {
  if (req.params.id != '') {
    req.session.albumlist.splice(req.params.id, 1);
  }
  res.redirect('/album');
})



/* On redirige vers la todolist si la page demandée n'est pas trouvée */
app.use(function(req, res, next){
    res.redirect('/home');
})

.listen(8080);
