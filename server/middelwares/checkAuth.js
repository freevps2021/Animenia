const jwt = require('jsonwebtoken');



module.exports = async (req, res, next)=>{
    const tokenBearer= req.headers.authorization;
    if(typeof tokenBearer !== 'undefined'){
      const bearer = tokenBearer.split(' ');
      const token = bearer[1];
      req.token = token;
      try{
        let user = await jwt.verify(req.token, process.env.JWT_SECRET);
        if(user){
            req.user = user.id;
        }
      }catch(err){
          if(err){
              return res.json({status:401, success:false, err:err});
          }
      }
    }
    next();
  
  }