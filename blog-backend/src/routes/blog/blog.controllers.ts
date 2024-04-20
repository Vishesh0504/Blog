import { Request, Response } from "express";
import { db_config } from "../../../constants";
const { Client } = require("pg");


const createBlog = async (req: Request, res: Response) => {
  const client = new Client(db_config);
  const user_id = req.user?.id;
  const {
    blogName,
    aboutBlog,
    aboutAuthor,
    twitter,
    instagram,
    linkedin,
    github,
  } = req.body;
  try {
    await client.connect();
    await client.query(
      "Insert into blog (user_id,blog_name,about_blog) values ($1,$2,$3) returning blog_id",
      [user_id, blogName, aboutBlog],
    );
    await client.query(
      "Insert into user_details (user_id,about_author,x,ig,linkedin,github) values ($1,$2,$3,$4,$5,$6)",
      [user_id, aboutAuthor, twitter, instagram, linkedin, github],
    );
    res.status(201).json({ message: "Blog Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.end();
    console.log("Client Disconnected");
  }
};

const getBlog = async (req: Request, res: Response) =>
  {
    const client = new Client(db_config);
    const user_id = req.params.user_id;
    console.log('user_id:',user_id);
    try{
      await client.connect();
      const blog = await client.query("Select * from blog where user_id=$1",[user_id]);
      // console.log(blog);
      res.status(200).json(blog.rows[0]);
    }catch(err){
      console.log(err);
      res.status(500).json({error:"Internal Server Error"});
    }finally{
      await client.end();
      console.log("Client Disconnected");
    }
  }

export { createBlog,getBlog};
