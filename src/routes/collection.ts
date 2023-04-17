import { Router } from "express";
const router = Router();
import { Request, Response } from "express";
import { BearerToken } from "../middlewares/middewares";

router.get('/collections', BearerToken, () => {});

module.exports = router;