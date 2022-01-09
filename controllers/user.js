const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");

function signUp(req, res){
    const user = new User();
    const {name, lastName, email, password, repeatPassword} = req.body;
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.role = "admin";
    user.active = false;
    
    if(!password || !repeatPassword){
        res.status(404).send({message: "contraseñas obligatorias"});
    }else{
        if(password != repeatPassword){
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

module.exports = {
    signUp
};