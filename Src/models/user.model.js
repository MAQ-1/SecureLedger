const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required for creating an account"],
        trim:true
    },
    email: {
        type: String,
        required: [
            true,
            "Email is required"
        ],
        trim:true,
        lowercase:true,
         match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email address.'
                ],
        unique: [true,
            "Email already exists"
               ]
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be at least 6 characters long"],
        select:false  // Exclude password from query results by default
    }
},{
    timestamps:true // Automatically add createdAt and updatedAt fields
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
     return next(); // Only hash the password if it has been modified (or is new))
    }

    const hash = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
    this.password = hash;

    return next();
        
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password); // Compare the provided password with the hashed password
};

const userModel= mongoose.model('User', userSchema);

module.exports=userModel;