var express = require('express');
var app = express();
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var path = require('path');
var formidable = require('formidable'); // parse the incoming form data (the uploaded files)
var fs = require('fs'); // used to rename uploaded files




// set the view engine to ejs
app.set('view engine', 'ejs');
// middleware to serve up the static files in our public/ directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/home.html'));
});



// Create the upload/ route to handle the incoming uploads via the POST method:

app.post('/upload', function(req, res){
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });
  // parse the incoming request containing the form data
  form.parse(req);
});



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
