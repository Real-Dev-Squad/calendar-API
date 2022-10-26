const express = require('express');
const router = express.Router();
import health from './health'

router.get("/health", health);

export default router
