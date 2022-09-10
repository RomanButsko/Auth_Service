import { Router } from 'express';
import UserController  from '../controllers/user-conroller.js';
import {body} from 'express-validator';
import { authMiddleware } from '../middlewares/auth-middleware.js';
const router = new Router();

router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    UserController.registration)
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.get('/activate/:link', UserController.activeUser);
router.get('/refresh',  UserController.refreshUser);
router.get('/users', authMiddleware, UserController.getUser);

export default router;
