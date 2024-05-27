import { Router } from "express";
import { verifyAuthentication } from "../../protected";
import { createCategory, getCategories } from "./categories.controllers";

const categoriesRouter = Router();

categoriesRouter.get('/getCategories',getCategories);
categoriesRouter.post('/createCategory',createCategory);


export default categoriesRouter;