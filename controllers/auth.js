const jwt = require('../services/jwt');
const moment = require('moment');
const user = require('../models/user');

function willExpiredToken(token){
    const {exp} = jwt.decodedToken(token);
    const currentDate = moment.unix();

    if(currentDate > exp){
        return true;
    }

    return false;
}

function refreshAccessToken(req, res){
   const {refreshToken} = req.body;
   const isTokenExpired = willExpiredToken(refreshToken);

   if(isTokenExpired){
       res.status(404).send({message: "Refresh Token expired"});
   }else{
      const {id} = jwt.decodedToken(refreshToken);
      user.findOne({__id: id}, (err, userStored) => {
        if(err){
            res.status(500).send({message: "server error" });
        }else{
            if(!userStored){
                res.status(404).send({message: "user not found"})
            }else{
                res.status(200).send({
                    accessToken: jwt.createAccessToken(userStored),
                    refreshToken: refreshToken
                })
            }
        }
      });
   }
}

module.exports = {
    refreshAccessToken
}