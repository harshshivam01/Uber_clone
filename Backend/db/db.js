const mongoose = require('mongoose');
require('dotenv').config();

const connectDb=(db_name)=>{
    const url= process.env.DB_CONNECTION_STRING+db_name+"?retryWrites=true&w=majority&appName=HarshShivam"
    mongoose
    .connect
    (url)

        .then(()=>{ 
            console.log(`Connected to ${db_name} database`)

        })
       .catch(err=> console.error(`Error connecting to ${db_name} database`, err))
    

}

module.exports=connectDb;