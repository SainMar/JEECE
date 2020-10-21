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
            name: userS.prenom,
            url_img: userS.urlPhoto,
        });
      })
      .catch(error => res.status(400).json({ error }));
};