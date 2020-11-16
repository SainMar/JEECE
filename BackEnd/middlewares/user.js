//Librairie qui contient le msgSchema (modèle de données d'un message)
const User = require('../objets/userSchema.js');
var ObjectID = require('mongodb').ObjectID;

//Recevoir info sur user
exports.findUser = (req, res) => {
    //console.log('Voici lid du user:  '+req.body.userId);
    User.findOne({"_id" : ObjectID(req.body.userId)})
      .then(userS =>{
        if(!userS) {
            console.log('ya pas lutilisateur');
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        
        res.status(200).json({
            message : "Yolo le toke ne marche pas ETRANGE",
            prenom: userS.prenom,
            nom: userS.nom,
            email: userS.email,
            urlPhoto: userS.urlPhoto,
        });
      })
      .catch(error => res.status(400).json({ error }));
};


exports.getListUser = (req, res) => {
    
    User.find()
      .then(tabUser => {

        if(!tabUser) {
          console.log('ya pas lutilisateur');
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        res.status(200).json({
          listUser: tabUser
        });


      })
      .catch(error => res.status(400).json({ error }) );
};