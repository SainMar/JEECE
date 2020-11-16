//Token d'authentification
const jwt = require('jsonwebtoken');

//Comparaison des token d'authentification
module.exports = (req, res, next) => {
  try {
    console.log('dans token.js:  ' + req.headers.authorization);
    const token = req.headers.authorization;
    console.log('avant decodedToken ; token:  '+ token   )
    try {
      const decodedToken = jwt.verify(token, '07a1c869f7bc7b20c2058ebabf8a0ad9'); //Comparaison des tokens
    }catch(err){
      console.log(err)
    }
    console.log('decodedToken:    '+decodedToken)
    const userId = decodedToken.userId;
    console.log('voici le user id:   '+req.body.userId);
    //Indique que le token ne correspond pas au User
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Requete invalide !')
    });
  }
};
