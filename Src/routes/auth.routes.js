const express=require('express');
const router=express.Router();
const authRouter=require('../controllers/auth.controllers');


router.post("/register",authRouter.userRegister);
router.post("/login",authRouter.userlogin);
module.exports=router;