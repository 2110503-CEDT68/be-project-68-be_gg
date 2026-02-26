const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);


const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser=require('cookie-parser');

dotenv.config({path:'./config/config.env'});

connectDB();

const hospitals = require('./routes/hospitals');
const appointments  = require('./routes/appointments');
const auth = require('./routes/auth');

const app=express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Query Parser
app.set('query parser','extended');

/*app.get('/', (req,res) => {
    //res.send('<h1>Hello from express</h1>');
    //res.send({name:'Brad'});
    //res.json({name:'Brad'});
    //res.sendStatus(400);
    //res.status(400).json({success:false});
    res.status(200).json({success:true, data:{id:1}});
});*/

app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/auth',auth);

const PORT=process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});
