import { createPost } from "./posts.controllers";

const {Router } = require('express');


const postRouter = Router();

postRouter.post("/createPost",createPost)

export default postRouter;
