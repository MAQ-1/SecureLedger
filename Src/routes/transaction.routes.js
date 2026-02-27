const {Router}=require('express');
const authMiddleware=require('../middleware/auth.middleware');
const transactionController=require('../controllers/transcation.controller');
const transactionRoutes=Router();

// post api/transactions


transactionRoutes.post('/',authMiddleware.authMiddleware,transactionController.createTransaction)

module.exports=transactionRoutes;