const express = require('express');
const router = express.Router();
import { InjectApiKey } from '../middlewares/middewares';

router.get('/bibles',  InjectApiKey, () => {

});

export default router