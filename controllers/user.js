const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");

function signUp(req, res){
    const user = new User();
    const {name, email, password, passwordRepeat, remember } = req.body;
    user.name = name;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;
    user.remember = remember; 
    
    if(!password || !passwordRepeat){
        res.status(404).send({message: "contraseñas obligatorias"});
    }else{
        if(password != passwordRepeat){
            res.status(404).send({message: "las contraseñas deben ser iguales"})
        }else{
            bcrypt.hash(password, null, null, function(err, hash){
                if(err){
                    res.status(500).send({message: "error de encriptado"});
                }else{
                    user.password = hash;

                    user.save( (err, userStored) => {
                        if(err){
                            res.status(500).send({message: "El usuario ya existe!"})
                        }else{
                            if(!userStored){
                                res.status(404).send({message: "error al crear el usuario"});
                            }else{
                                res.status(200).send({user: userStored})
                            }
                        }
                    });
                    //res.status(200).send({message: hash});
                }
            }); 
            //res.status(200).send({message: "Usuario Creado"});
        }
    }

}

function signIn(req, res){
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({email},(error, userStored) => {
        if(error){
            res.status(500).send({message: "Error del servidor"})
        }else{
            if(!userStored){
                res.status(404).send({message: "Usuario no encontrado"})
            }else{
                bcrypt.compare(password, userStored.password, (err, isValid) => {
                    if(err){
                        res.status(500).send({message: "error del servidor"});
                    }else if (!isValid){
                        res.status(404).send({message: "contraseña incorrecta"});
                    }
                    else{
                        if(!userStored.active){
                            res.status(200).send({code: 200, message: "el usuario NO esta activado!"});
                        }else{
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                })
            }
        }
    } )
}

module.exports = {
    signUp,
    signIn
};