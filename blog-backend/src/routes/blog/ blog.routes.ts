import { createBlog } from "./blog.controllers";

const { Router } = require("express");

const blogRouter = Router();

blogRouter.post("/createBlog", createBlog);

export default blogRouter;
