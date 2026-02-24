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

module.exports={
    createAccount
}

