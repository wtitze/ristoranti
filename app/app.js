/*eslint-env node*/

var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

var MongoClient = require('mongodb').MongoClient;

// 7.1 caricamento nome e indirizzo ristoranti (primi 20) in ordine alfabetico
app.get('/', function (req, res) {
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find().limit(20).sort({name:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.render('es71result', {message: 'nome e indirizzo ristoranti di New York', title:'ristoranti', list: result});
        db.close();
      });
    });
});

// 7.2 caricamento dei ristoranti di un quartiere
app.get('/borough', function (req, res) {
    // invio form per l'inserimento del quartiere da parte dell'utente
    res.render('es72form', {message: 'inserisci il nome del quartiere', title:'ristoranti'});
});

app.get('/sendBorough', function (req, res) {
    // ricezione quartiere
    var quartiere = req.query.quartiere;
    
    // ricerca ristoranti
        MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find({borough:quartiere}).limit(20).sort({name:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.render('es71result', {message: 'nome e indirizzo ristoranti del quartiere ' + quartiere, title:'ristoranti', list: result});
        db.close();
      });
    });
});

// 7.3 caricamento dei ristoranti di un quartiere
app.get('/boroughList', function (req, res) {
    // invio form per la scelta del quartiere da parte dell'utente
    // ricerca dei quartieri

    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").aggregate( [ { $group : { _id : "$borough" } }, {$sort : {_id:1}} ] ).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.render('es73form', {message: 'scegli il quartiere', title:'ristoranti', list: result});
        db.close();
      });
    });
});

// per ricercare i ristoranti del quartiere si riutilizza /sendBorough
// quindi non c'è bisogno di fare un'altra get()
// si veda quindi es73form

// 7.4 elenco dei ristoranti che fanno un certo tipo di cucina
app.get('/cuisineList', function (req, res) {
    // invio form per la scelta del quartiere da parte dell'utente
    // ricerca dei quartieri

    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").aggregate( [ { $group : { _id : "$cuisine" } }, {$sort : {_id:1}} ] ).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.render('es74form', {message: 'scegli la cucina', title:'ristoranti', list: result});
        db.close();
      });
    });
});

app.get('/sendCuisine', function (req, res) {
    // ricezione tipo di cucina
    var cucina = req.query.cucina;
    
    // ricerca ristoranti
        MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find({cuisine: cucina}).limit(20).sort({name:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.render('es71result', {message: 'nome e indirizzo ristoranti che fanno cucina ' + cucina, title:'ristoranti', list: result});
        db.close();
      });
    });
});

// 7.5 selezione del quartiere e della cucina
app.get('/bcList', function (req, res) {
    // invio form per la scelta del quartiere da parte dell'utente
    // ricerca dei quartieri
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").aggregate( [ { $group : { _id : "$borough" } }, {$sort : {_id:1}} ] ).toArray(function(err, resultBorough) {
        if (err) {
          throw err;
        }
        dbo.collection("Restaurants").aggregate( [ { $group : { _id : "$cuisine" } }, {$sort : {_id:1}} ] ).toArray(function(err, resultCuisine) {
            if (err) {
                throw err;
            }
            res.render('es75form', {message: 'scegli il quartiere e la cucina', title:'ristoranti', lists: {Borough: resultBorough, Cuisine: resultCuisine}});
        });
        db.close();
      });
    });
});

app.get('/sendBoroughAndCuisine', function (req, res) {
    // ricezione quartiere
    var quartiere = req.query.quartiere;
    var cucina = req.query.cucina;
    
    // ricerca ristoranti
        MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find({borough: quartiere, cuisine: cucina}).limit(20).sort({name:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length > 0)
            res.render('es71result', {message: 'nome e indirizzo ristoranti del quartiere ' + quartiere + ' che fanno cucina ' + cucina, title:'ristoranti', list: result});
        else
            res.render('es71result', {message: 'non ci sono ristoranti del quartiere ' + quartiere + ' che fanno cucina ' + cucina, title:'ristoranti'});
        db.close();
      });
    });
});

// 7.6 ricerca del ristorante per nome parziale
app.get('/string', function (req, res) {
    // invio form per l'inserimento del nome (o di parte di esso) da parte dell'utente
    res.render('es76form', {message: 'inserisci alcune lettere del nome del ristorante', title:'ristoranti'});
});

app.get('/sendString', function (req, res) {
    // ricezione di parte del nome del ristorante
    var nomeParz = req.query.nomeParz;
    
    // ricerca ristoranti
        MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find({name: new RegExp(nomeParz, "i")}).sort({name:1}).limit(20).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length > 0)
            res.render('es71result', {message: 'nome e indirizzo ristoranti che hanno la stringa ' + nomeParz + ' nel loro nome', title:'ristoranti', list: result});
        else
            res.render('es71result', {message: 'non ci sono ristoranti che hanno la stringa ' + nomeParz + ' nel loro nome', title:'ristoranti'});       
        db.close();
      });
    });
});

// 7.7 ricerca del ristorante per nome parziale e visualizzazione sulla mappa di New York
app.get('/stringMap', function (req, res) {
    // invio form per l'inserimento del nome (o di parte di esso) da parte dell'utente
    res.render('es77form', {message: 'inserisci alcune lettere del nome del ristorante', title:'ristoranti'});
});

app.get('/sendStringMap', function (req, res) {
    // ricezione di parte del nome del ristorante
    var nomeParz = req.query.nomeParz;
    
    // ricerca ristoranti
        MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Restaurants").find({name: new RegExp(nomeParz, "i")}).sort({name:1}).limit(20).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length > 0)
            res.render('es77result', {message: 'nome e indirizzo dei ristoranti che hanno la stringa "' + nomeParz + '" nel loro nome', title:'ristoranti', list: result});
        else
            res.render('es77result', {message: 'non ci sono ristoranti che hanno la stringa "' + nomeParz + '" nel loro nome', title:'ristoranti'});       
        db.close();
      });
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
