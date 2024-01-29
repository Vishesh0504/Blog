const fs = require('fs');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const {connect_db} = require('../constants');
const path =require('path');

require('dotenv').config({path : '../.env'});

const PORT = process.env.serverPort;

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended :true}));

console.log();
connect_db();


https.createServer(
    {
        key : fs.readFileSync(path.join(__dirname,'../certificates/key.pem')),
        cert : fs.readFileSync(path.join(__dirname,'../certificates/cert.pem'))
    },app).listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`)
    })