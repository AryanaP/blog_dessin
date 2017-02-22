var express = require('express');
var app = express();
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: true });
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var formidable = require('formidable'); // to parse incoming form data (uploaded files)
var fs = require('fs'); // to rename uploaded files


// set the view engine to ejs
app.set('view engine', 'ejs');
// middleware to serve up the static files in our public/ directory
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.post('/upload_pic', function(req, res){
  var chosenAlbum = req.body.album_name;
  console.log(chosenAlbum);
});

// Create the upload/ route to handle the incoming uploads via the POST method: -
app.post('/upload', function(req, res){
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // allows user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  var file_name = '/uploads/';
  form.uploadDir = path.join(__dirname, file_name)
  // each file uploaded successfully is renamed to orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  // once all uploaded, send a response to client
  form.on('end', function() {
    res.end('success');
  });
  // parse the incoming request containing the form data
  form.parse(req);
});



// NPM Node Gallery
app.use('/gallery', require('node-gallery')({
  staticFiles : 'uploads',
  urlRoot : 'gallery',
  title : 'Example Gallery'
}));


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

// UPLOAD PAGE
/* Afficher les uploads et les photos */
app.get('/uploader', function (req, res) {
  res.render('pages/uploader.ejs');
})

app.get('/uploader/:chosenAlbum', function (req, res) {
  res.render('pages/uploader.ejs', {album: req.params.chosenAlbum});
})


/* On redirige vers l'accueil si la page demandée n'est pas trouvée */
app.use(function(req, res, next){
    res.redirect('/');
})

.listen(8080);


