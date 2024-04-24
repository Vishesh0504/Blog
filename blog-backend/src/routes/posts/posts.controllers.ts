import { Request, Response } from "express";
import { db_config } from "../../../constants";


const { Client } = require("pg");


const createPost = async (req: Request, res: Response) => {
    const client = new Client(db_config);
    try{
        await client.connect();
        const {blog_id} = req.body;
        const creation_time = new Date();
        const post_id = await client.query("insert into posts (blog_id,creation_time) values ($1,$2) returning post_id",[blog_id,creation_time]);
        res.status(201).json({message:"New Article initialized",post_id:post_id.rows[0].post_id});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }finally{
        await client.end();
        console.log("Client Disconnected");
    }
}

export { createPost}