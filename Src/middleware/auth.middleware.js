const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');



async function authMiddleware(req,res,next){

      // Get token from cookies or Authorization header
          const token =req.cookies.token || req.headers.authorization?.split(" ")[1]; 

          if(!token){
            return res.status(401).json({
                message:"No token provided. Please login to access this resource.",
                
            });
          }
    try{  
         
         // Verify the token and decode the payload
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId)
        req.user=user; // Attach user information to the request object for use in subsequent middleware or route handlers
        return next(); // Proceed to the next middleware or route handler

    }catch(error){
        return res.status(401).json({
            message:"Invalid token. Please login again.",
            error:error.message
        });
    }
}

module.exports={
    authMiddleware,
}