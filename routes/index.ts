const express = require('express');
const router = express.Router();
import health from './health'

router.get("/healthcheck", health);

export default router
