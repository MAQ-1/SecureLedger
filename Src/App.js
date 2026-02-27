// Server ko create krna or config krna 

const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();// server instance

app.use(express.json());// to parse JSON request bodies
app.use(cookieParser());



// Routes
const authRouter=require('./routes/auth.routes');
const accountRouter=require('./routes/account.routes');
const transactionRouter=require('./routes/transaction.routes');


// -USe routers
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);



module.exports=app;