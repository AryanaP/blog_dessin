var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


// render will automatically look in the views folder


// accueil
app.get('/', function (req, res) {
  res.render('pages/home.ejs');
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});


// album
app.get('/album', function (req, res) {
  var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code blablablablabla bla";

    res.render('pages/album.ejs', {
        drinks: drinks,
        tagline: tagline
    });
});


/* On affiche la todolist et le formulaire */
// .get('/todo', function(req, res) {
//     res.render('todo.ejs', {todolist: req.session.todolist});
// })

/* On ajoute un élément à la todolist */
// .post('/todo/ajouter/', urlencodedParser, function(req, res) {
//     if (req.body.newtodo != '') {
//         req.session.todolist.push(req.body.newtodo);
//     }
//     res.redirect('/todo');
// })


/* Supprime un élément de la todolist */
// .get('/todo/supprimer/:id', function(req, res) {
//     if (req.params.id != '') {
//       req.session.todolist.splice(req.params.id, 1);
//     }
//     res.redirect('/todo');
// })

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
app.use(function(req, res, next){
    res.redirect('/home');
})


.listen(8080);
