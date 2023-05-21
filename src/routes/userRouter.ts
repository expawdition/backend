import express from "express";
const router = express.Router();

import { test } from "../controllers/userController";

router.get("/", test);

export default router;
