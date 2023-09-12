import { Router } from 'express';
import timezone from '../controllers/timezone';

const router = Router();

router.get('/', timezone);

export default router;
