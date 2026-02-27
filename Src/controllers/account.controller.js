const accountModel=require('../models/account.model');


// create a account
async function createAccount(req,res){
    const user=req.user; 

    try{
        const account=await accountModel.create({
        user:user._id
    });

    res.status(201).json({
        message:"Account created successfully",
        account:account
    });

}catch(error){
    res.status(500).json({
        message:"Something went wrong while creating the account.",
        error:error.message
    });

 
}

}

// get account details
async function getAccountDetails(req,res){
    try{
          const user=req.user;
          if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
            }
          const account=await accountModel.findOne({user:user._id})
          .populate('user','name email');

          if(!account){
            return res.status(404).json({
                message:"Account not found for the user."
            });
          }

          

          res.status(200).json({
            message:"Account details fetched successfully.",
            account:account,
            
          });
    }catch(error){
        res.status(500).json({
            message:"Something went wrong while fetching account details.",
            error:error.message
        });
}
}

// get account balance
async function getAccountBalance(req,res){
    try{
          const {accountId}=req.params;

          const account=await accountModel.findOne({
            _id:accountId,
            user:req.user._id
          });
          console.log("Account found:", account);
      
          if(!account){
            return res.status(404).json({
                message:"Account not found for the user."
            });
          }

          const balance=await account.getBalance();
          
          res.status(200).json({
            message:"Account balance fetched successfully.",
            balance:balance
          });


    }catch(error){
        console.error("GetAccountBalance Error:", error);
        res.status(500).json({
            message:"Something went wrong while fetching account balance.",
            success: false
        });
    }
}
module.exports={
    createAccount,
    getAccountDetails,
    getAccountBalance
}

