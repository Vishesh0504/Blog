import { Request,Response } from "express";

import { db_config } from "../../../constants";
const { Client } = require("pg");

async function getCategories(req:Request,res:Response){
    const client = new Client(db_config);
    try{
        await client.connect();
        const categories = await client.query("Select * from categories");
        res.status(200).json(categories.rows);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }finally{
        await client.end();
        console.log("Client Disconnected");
    }
}

async function createCategory(req:Request,res:Response){
    const client = new Client(db_config);
    const {category} = req.body;
    try{
        await client.connect();
        await client.query("Insert into categories (category) values ($1)",[category]);
        res.status(201).json({message:"Category Created"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }finally{
        await client.end();
        console.log("Client Disconnected");
    }
}

export {getCategories,createCategory};