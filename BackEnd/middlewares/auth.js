//Authentification Utilisateur

const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');

//Librairie qui contient le userSchema (modèle de données d'un user)
const User = require('../objets/userSchema.js');

//Inscription (Prénom, Nom, Email, Password)
exports.signup = (req, res, next) => {
  //On hash le password 10 fois
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    //On crée un nouvel user
    const user = new User({
      prenom: req.body.prenom,
      nom: req.body.nom,
      email: req.body.email,
      password: hash
    });
    //Sauvegarde du nouvel User
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
    .catch(error => res.status(400).json({ error: 'Paramètres incorrectes !' }));
  })
  .catch(error => res.status(500).json({ error: "Error server !"}));
};

//Connexion (Email, Password)
exports.login = (req, res, next) => {
  //On essaie de trouver l'user qui se connecte via ses identifiants
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    //Comparaison hash Password
    bcrypt.compare(req.body.password, user.password)
    .then(validate => {
      if(!validate) {
        return res.status(401).json({ error: 'Mot de passe incorrect !' });
      }
      //On renvoie l'ID et le token du user
      res.status(200).json({
        userId: user._id,
        token: token.sign(
          { userId: user._id },
          '07a1c869f7bc7b20c2058ebabf8a0ad9',
          { expiresIn: '24h' }
        )
      });
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

//Modification de la photo du User
exports.modifyPhoto = (req, res, next) => {
  //Si il y a bien une image
  const userObject = req.file ? {
    ...JSON.parse(req.body.user),
    //On récupère le chemin absolu de l'image
    urlPhoto: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };
  //On update l'objet User (recherche par email car il est unique)
  User.updateOne({ email: userObject.email }, { ...userObject })
  .then(() => res.status(200).json({ message: 'User modifié !'}))
  .catch(error => res.status(400).json({ error }));
};
