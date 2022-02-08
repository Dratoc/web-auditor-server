const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "FBWjUauAdwmp62geFzypb6CVjuyWNKtGFtFnEBmtpMeZyR6LY8";

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res
            .status(403)
            .send({message: "the request no have authorization header "});
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment.unix()){
            return res.status(404).send({message: "token has expired"});
        }
    } catch (error) {
        //console.log(ex);

        return res.status(404).send({message: "Token is not valid"})
    }

    req.user = payload;
    next();
}