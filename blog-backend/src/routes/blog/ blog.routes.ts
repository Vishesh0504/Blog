import { createBlog, getBlog } from "./blog.controllers";

const { Router } = require("express");

const blogRouter = Router();

blogRouter.post("/createBlog", createBlog);
blogRouter.get("/getBlog/:user_id",getBlog );

export default blogRouter;
