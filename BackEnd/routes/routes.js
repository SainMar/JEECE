//Routes d'accès aux différentes fonctionnalités

const express = require('express');
const routes = express.Router();

//Authentification User
const userAuth = require('../middlewares/auth.js');
//Messages User
const message = require('../middlewares/msg.js');
//Token d'authentification
const token = require('../middlewares/token.js');
//Modifier la photo du User
const image = require('../middlewares/images.js');
//Recevoir information sur un user
const user = require('../middlewares/user.js');


//Inscription
routes.post('/auth/signup', userAuth.signup);
//Connexion
routes.post('/auth/login', userAuth.login);

//Info User
routes.post('/user/findUser', /*token,*/ user.findUser);
//List User 
routes.get('/user/listUser', /*token,*/ user.getListUser);



//Page d'accueuil
routes.post('/messagerie/accueuil', /*token,*/  message.pageAccueil);
//Modifier la photo du User
routes.put('/messagerie/accueuil/photo', token, image, userAuth.modifyPhoto);
//Envoyer des messages
routes.post('/messagerie/:room', token, message.sendMsg);
//Recevoir les messages
routes.get('/messagerie/:room', /*token,*/ message.recvMsg);


module.exports = routes;
