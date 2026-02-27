const express=require('express');
const authMiddleware=require('../middleware/auth.middleware');
const accountController=require('../controllers/account.controller');
const csrf = require('csurf');
const router=express.Router();

const csrfProtection = csrf({ cookie: true });

router.post("/",authMiddleware.authMiddleware,csrfProtection,accountController.createAccount);


router.get("/",authMiddleware.authMiddleware,accountController.getAccountDetails);

router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalance);
module.exports=router;
