import { Router } from 'express';
import AuthController from './controller';

const router: Router = Router();
router.post('/login', AuthController.login);
router.post('/createUser', AuthController.createUser);

export default router;
