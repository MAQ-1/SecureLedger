const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const emailService=require('../services/email.service');

// User Registration
// @route POST /api/auth/register
async function userRegister(req,res){

    try{
                const {name,email,password}=req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({error:"Please provide name, email and password"});
        }

        const isExist = await userModel.findOne({email:email});
        if(isExist){
            return res.status(422).json({
                message:"Email already exists. Please use a different email or login.",
                status:"error"
            });
        } 

        const user =await userModel.create({
            name,email,password
        });

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token",token);

        res.status(201).json({
             user:{
                _id:user._id,
                name:user.name,
                email:user.email
             },
             token:token
        });

        await emailService.sendRegisterationEmail(user.email,user.name);

    } catch(error){
        res.status(500).json({
            message:"Something went wrong while registering the user.",
            error:error.message
        })

    }
        

}

// -User login 
//  post/api/auth/login

async function userlogin(req,res){
    try{
       const{email,password}=req.body;

       if(!email || !password){
        return res.status(401).json({
            message:"Please provide email and password",
            status:"error"
        })
       }

       const user=await userModel.findOne({email:email}).select("+password"); // Select the password field explicitly since it's excluded by default in the schema
       if(!user){
        return res.status(401).json({
            message:"Email and Password do not match",
            
        })
       }

       const isValidPassword=await user.comparePassword(password);
       if(!isValidPassword){
        return res.status(401).json({
            message:"Email and Password do not match", 
        });
        
      }

      const token= jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
      res.cookie("token",token);

      res.status(200).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        },
        token:token
      });

    

    }catch(error){
        res.status(500).json({
            message:"Something went wrong while logging in the user.",
            error:error.message
        })
    }
}


module.exports={userRegister,userlogin};