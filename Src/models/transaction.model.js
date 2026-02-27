const mongoose=require('mongoose');


const transactionSchema=new mongoose.Schema({
      
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"Transaction must have a source account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"Transaction must have a destination account"],
        index:true
    },

    status:{
        type:String,
        enum:{
            values:["Pending","Completed","Failed","Refunded"],
            message:"Status must be either Pending, Completed, Failed or Refunded"
    },
    default:"Pending"
         },

    amount:{
        type:Number,
        required:[true,"Transaction amount is required"],
        min:[0,"Transaction amount must be greater than 0"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required for processing transactions"],
        unique:true,
        index:true
     }
},{
    timestamps:true

    });

const transactionModel=mongoose.model('transaction',transactionSchema);

module.exports=transactionModel;