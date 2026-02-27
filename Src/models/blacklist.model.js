const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
     token:{
        type:String,
        required:[true,"token is required to blacklist"],
        unique:[true,"token already exists in blacklist"]
     }
     
},{
   timestamps:true      
});

blacklistSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3 // 3 days
})

const tokenBlackListModel = mongoose.model("tokenBlackList", blacklistSchema);

module.exports = tokenBlackListModel;