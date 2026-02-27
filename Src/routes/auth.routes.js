const express=require('express');
const router=express.Router();
const authRouter=require('../controllers/auth.controllers');

// post register and login routes
router.post("/register",authRouter.userRegister);
router.post("/login",authRouter.userlogin);

// Post logout route
router.post("/logout",authRouter.userLogout);

module.exports=router;