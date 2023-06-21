const jwt = require("jsonwebtoken");
const JWT_secret = "SecretFriend";


const fetchuser=(req,res,next)=>{

    const token=req.header('auth-token');
    if(!token){
        res.status(401).json({error:"Please authenticate using a valid token"});
    }
    
    try{
        const data=jwt.verify(token,JWT_secret);
        req.user=data.id;
        next();
    }
    catch(err){
        res.status(401).json({error:"Please authenticate using a valid token"});
    }

   
}

module.exports=fetchuser;