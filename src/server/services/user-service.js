import UserModels from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from './mail-service.js';
import  tokenService from './token-service.js';
import { userDto } from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

class UserService {
    async registration(email, password) {
        const candidate = await UserModels.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('Пользователь уже зарегестрирован')
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4();
        const user = await UserModels.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationLink(email ,`${process.env.DB_AUTH_SEND_SITE}/api/activate/${activationLink}`);
        const userModel = new userDto(user)
        const tokens = tokenService.generateToken({...userModel})
        await tokenService.saveToken(userModel.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userModel
        }
    }
    async activate(activationLink) {
        const user = await UserModels.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest('Неккоректная ссылка')
        }
        user.isActivated = true
        await user.save();
    }

    async login(email, password) {
        const user = await UserModels.findOne({email});
        if(!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const compareTwoPassword = bcrypt.compare(password, user.password)
        if (!compareTwoPassword) {
            throw ApiError.BadRequest('Пароль неверен')
        }

        const userModel = new userDto(user)
        const tokens = tokenService.generateToken({...userModel})
        await tokenService.saveToken(userModel.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userModel
    }
}
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unAuthError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.unAuthError();
        }
        const user = await UserModels.findById(userData.id)
        const userModel = new userDto(user)
        const tokens = tokenService.generateToken({...userModel})
        await tokenService.saveToken(userModel.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userModel
    }
    }
    
    async getAllUsers() {
        const users = await UserModels.find();
        return users;
    }
}

export default new UserService();