const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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

function getUsers(req, res){
    User.find().then(users => {
        if(!users){
            res.status(404).send({message: "User no found" });
        }else{
            res.status(200).send({users});
        }
    })
}

function uploadAvatar(req, res){
    const params = req.params;

    User.findById({_id: params.id}, (err , userData) => {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        } else {
            if(!userData){
                res.status(404).send({message: "User not found"});
            }else{
                let user = userData;
                
                if(req.files){
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split("\\");
                    let fileName = fileSplit[2];
                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];

                    if(fileExt !== "png" && fileExt !== "jpg"){
                        res.status(400).send({
                            message: "image is not valid"
                        })
                    }else{
                        user.avatar = fileName;
                        User.findByIdAndUpdate({_id: params.id}, user, (error , userResult) => {
                            if(error){
                                res.status(500).send({message: "server error"});
                            }else{
                                if(!userResult){
                                    res.status(404).send({message: "user not found"});
                                }else{
                                    res.status(200).send({avatarName: fileName})
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function getAvatar(req, res){
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/"+ avatarName;

    fs.exists(filePath, exists => {
        console.log(filePath);
        if(!exists){
            res.status(404).send({message: "Avatar not found"});
        }else{
            res.sendFile(path.resolve(filePath));
        }
    });

}

function updateUser(req, res){
    const userData = req.body;
    const params = req.params;

    User.findByIdAndUpdate({ _id: params.id }, userData, (error, userUpdate) => {
        if(error){
            res.status(500).send({message: "server error"});
        }else{
            if(!userUpdate){
                res.status(404).send({message: "user not found"});
            }else{
                res.status(200).send({message: "user update successfully"});
            }
        }
    })
}

module.exports = {
    getUsers,
    signUp,
    signIn,
    uploadAvatar,
    getAvatar,
    updateUser
};