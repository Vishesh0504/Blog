const fs = require('fs');
const path = require('path');
const {Client} = require('pg');


require('dotenv').config({path:'../.env'});
const db_config = {
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.PORT,
    database: process.env.database,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname,'../certificates/ca.pem'))
    },
}



function connect_db(){
    const client = new Client(db_config);
    client.connect(function (err: any) {
    if (err) throw err;
    client.query("SELECT VERSION()", [], function (err: any, result: { rows: any[]; }) {
        if (err) throw err;

        console.log(result.rows[0]);
        client.end(function (err: any) {
        if (err) throw err;
        });
    });
    });
}

module.exports ={
    connect_db,
}