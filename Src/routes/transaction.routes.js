const express=require('express');
const authMiddleware=require('../middleware/auth.middleware');
const transactionController=require('../controllers/transcation.controller');
const router=express.Router();

router.post('/',authMiddleware.authMiddleware,transactionController.createTransaction);

router.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialTransaction);

module.exports=router;