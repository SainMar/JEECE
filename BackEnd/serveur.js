//Serveur

//Librairies
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ent = require('ent');

//Librairie qui contient les routes d'accès aux différentes fonctionnalités
const routes = require('./routes/routes.js');

//Framework express
const app = express();
//Création du serveur
const server = http.createServer(app);
//Connexion socketio
const io = socketio(server);

//Charge tous les fichiers statiques
app.use(express.static(__dirname));

//Connexion à la base de données
mongoose.connect('mongodb+srv://Ahaz1701:Ahaz1701@testjeece.a1tcc.mongodb.net/TestJEECE?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Permission FrontEnd (cross-origin)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

//Tableau des users connectés
var users = [];

//Lors de la connexion d'un user, on stocke dans ses variables de session, son pseudo et son id
io.on('connection', (socket, pseudo, id) => {
    //Evènement 'user_connected'
    socket.on('user_connected', () => {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.id = id;
        //On ajoute l'user dans la liste des users connectés
        users.push({id: id, pseudo: pseudo});
        console.log(socket.pseudo + " est connecté");
        //On renvoie le tableau des users connectés
        socket.broadcast.emit('user_connected', users);
    });

    //Lors de la déconnexion d'un user, on le retire du tableau des users connectés
    socket.on('disconnect', () => {
      var index = users.indexOf(socket.id);
      if (index > -1) {
        users.splice(index, 1);
      }
      console.log(socket.pseudo + " s'est déconnecté");
      //On renvoie le tableau des users connectés (évènement 'user_disconnected')
      socket.broadcast.emit('user_disconnected', users);
    });

    //Evènement 'joinRoom'
    socket.on('joinRoom', room => {
      //On ajoute le user à la room
      socket.join(room);
    });

    //Evènement 'message'
    socket.on('message', (message, room) => {
        message = ent.encode(message);
        //On renvoie le message du user à la room
        io.to(room).emit('message', {pseudo: socket.pseudo, message: message});
    });
});


//On parse les requêtes au format json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes d'accès aux divers fonctionnalités
app.use('/JEECE', routes);

//On écoute sur le port 7010
const PORT = 7010 || process.env.PORT;
server.listen(PORT, () => console.log(`Serveur running on port ${PORT}`));
