const mongoose =require('mongoose');

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"Ledger entry must be associated with an account"],
        index:true,
        immutable:true
    },
     amount:{
         type:Number,
         required:[true,"Ledger entry must have an amount"],
         index:true,
         immutable:true
     },
     transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        required:[true,"Ledger entry must be associated with a transaction"],
        index:true,
        immutable:true
     },
     type:{
        type:String,
        enum:{
            values:["Debit","Credit"],
            message:"Ledger entry type must be either Debit or Credit"
        },
        required:[true,"Ledger entry must have a type"],
        index:true,
        immutable:true
     }
})

function preventLedgerModification(){
     throw new Error("Ledger entries cannot be modified or deleted");

}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndRemove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);

const ledgerModel=mongoose.model('ledger',ledgerSchema);

module.exports=ledgerModel;