const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

//para solucionar error 
//mongoose.set("useFindAndModify", false);

mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/BD_AUDITOR`,
    {useNewUrlParser: true, useUnifiedTopology: true},    
    (err, res)=>{
        if(err){
            throw err;
        }else{
                console.log("         Conexion BD Correcta        ");
            app.listen(port, () => {
                console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬");
                console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬");
                console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬");
                console.log("               API REST                ");
                console.log("_______________________________________");
                console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
                
            } )
        }
    }
);
