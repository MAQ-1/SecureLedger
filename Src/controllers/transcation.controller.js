const transactionModel=require('../models/transaction.model');
const ledgerModel=require('../models/ledger.model');
const mongoose=require('mongoose');
const accountModel=require('../models/account.model');
const emailService=require('../services/email.service');



//  create a transaction 
// validate request
// validate idempotency key
// check account status
// Derive sender balance fromt he ledger 
// create transaction
//create credit ledger entry
//create debit ledger entry
//mark trnsaction as completed
// commit mongodb session
// send email notification to sender and receiver

async function createTransaction(req,res){
    try {
            const {fromAccount,toAccount,amount,idempotencyKey}=req.body;

            // Validate request data
            if(!fromAccount || !toAccount || !amount || !idempotencyKey){
                return res.status(400).json({
                    message:"Missing required fields. Please provide fromAccount, toAccount, amount, and idempotencyKey."
                });
            }

            const fromUserAccount=await accountModel.findOne({_id:fromAccount});
            const toUserAccount=await accountModel.findOne({_id:toAccount});

            if(!fromUserAccount || !toUserAccount){
                return res.status(404).json({
                    message:"One or both accounts not found. Please check the account IDs and try again."
                });
            }

            // validate idempotency key
            const existingTransaction=await transactionModel.findOne({idempotencyKey:idempotencyKey});
            if(existingTransaction){
                   if(existingTransaction.status==="Completed"){
                    return res.status(200).json({
                        message:"Transaction already processed successfully.",
                        transaction:existingTransaction
                    });
                   }

                   if(existingTransaction.status==="Pending"){
                    return res.status(202).json({
                        message:"Transaction is still being processed.",
                        
                    });
                   }

                   if(existingTransaction.status==="Failed"){
                    return res.status(409).json({
                        message:"Previous transaction attempt failed. Please try again with a new idempotency key.",    
                    });
                   }

                   if(existingTransaction.status==="Cancelled"){
                    return res.status(500).json({
                        message:"Previous transaction attempt was cancelled. Please try again with a new idempotency key.",    
                    });
                   }
            }

            // Check account status
            if((fromUserAccount.status === 'Active' || toUserAccount.status === 'Active')){
                 return res.status(403).json({
                    message:"One or both accounts are not active. Transactions can only be made between active accounts."
                 });
             }  

            // Derive sender balance fromt he ledger 

            const balance = await fromUserAccount.getBalance();
            
            if(balance < amount){
                return res.status(400).json({
                    message:`Insufficient funds. The sender's account balance is ${balance},
                    Requested amount is ${amount}. Please check the balance and try again.`
                });
            }


            // create transaction

             const session=await mongoose.startSession();
             session.startTransaction();

             const transaction=await transactionModel.create({
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status:"Pending"
             },{session:session});


        // create debit ledger entry
        const debitLedgerEntry=await ledgerModel.create({
            account:fromAccount,
            amount:amount,
            transaction:transaction._id,
            type:"Debit"
        },{session:session});
 
        // create credit ledger entry
        const creditLedgerEntry=await ledgerModel.create({
            account:toAccount,
            amount:amount,
            transaction:transaction._id,
            type:"Credit"
        },{session:session});
 
        // update transaction status to completed
        await transactionModel.findByIdAndUpdate(transaction._id,{
            status:"Completed"
        },{session:session});

        await session.commitTransaction();
        session.endSession();

        // send email notification to sender and receiver
        await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toUserAccount._id);
        
        res.status(201).json({
            message:"Transaction completed successfully.",
            transaction:transaction 

        });
    } catch(error) {
        res.status(500).json({
            message:"An error occurred while processing the transaction.",
            error:error.message
        });
    }
}


// Initial transaction creation steps:

async function createInitialTransaction(req,res){
    try{
          const { toAccount, amount, idempotencyKey } = req.body;

          if(!toAccount || !amount || !idempotencyKey){
            return res.status(400).json({
                message:"Missing required fields. Please provide toAccount, amount, and idempotencyKey."
            });
          }

        //   find receiver account
            const toUserAccount =await accountModel.findOne({_id: toAccount})
            if(!toUserAccount){
                return res.status(404).json({
                    message:"Receiver account not found."
                });
            }

        // user account 
        const fromUserAccount = await accountModel.findOne({
                user: req.user._id
         })
        
        //  start transaction session
        const session = await mongoose.startSession();
        session.startTransaction();
      
        // create transaction with pending status
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })


        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })


         await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction
        })

    }catch(error){
        console.error("Error creating transaction:",error);
        res.status(500).json({
            message:"An error occurred while doing the transaction.",
            error:error.message
        });
    }
}
module.exports={
    createTransaction,
    createInitialTransaction
}