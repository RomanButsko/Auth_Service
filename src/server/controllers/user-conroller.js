import { validationResult } from 'express-validator';
import userService from '../services/user-service.js';
import UserService from '../services/user-service.js'
import ApiError from './../exceptions/api-error.js'

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);  
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password} = req.body;
            const userData = UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch(e) {
            next(e)
        }
    }
    async loginUser(req, res, next) {
        try {
            const {email, password} = req.body; 
            const login = userService.login(email, password);
            res.cookie('refreshToken', login.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(login);
        }catch(e) {
            next(e)
        }
    }
    async logoutUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const logout =  await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(logout);
        }catch(e) {
            next(e)
        }
    }
    async getUser(req, res, next) {       
     try {
         const user = await UserService.getAllUsers();
         return res.json(user); 
    }catch(e) {
        next(e)
    }
    }
    async activeUser(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.DB_CLIENT_URL)
        }catch(e) {
            next(e)
        }
    }
    async refreshUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const login = userService.refresh(refreshToken);
            res.cookie('refreshToken', login.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(login);
        }catch(e) {
            next(e)
        }
    }
}

export default new UserController();