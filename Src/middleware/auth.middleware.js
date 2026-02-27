const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const tokenBlackListModel=require('../models/blacklist.model');

async function authMiddleware(req,res,next){

      // Get token from cookies or Authorization header
          const token =req.cookies.token || req.headers.authorization?.split(" ")[1]; 

          if(!token){
            return res.status(401).json({
                message:"No token provided. Please login to access this resource.",
                
            });
          }

              // Check if the token is blacklisted
              const isBlacklisted = await tokenBlackListModel.findOne({ token: token });
              if (isBlacklisted) {
                return res.status(401).json({
                    message: "Token has been blacklisted. Please login again.",     
                })
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

async function authSystemUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user

        return next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

}

module.exports={
    authMiddleware,
    authSystemUserMiddleware
}