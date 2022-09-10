import jwt from 'jsonwebtoken';
import TokenModele from '../models/token-model.js';

class tokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.DB_JW_ACCESS, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.DB_JW_REFRESH, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModele.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const newUser = TokenModele.create({user: userId, refreshToken})
        return newUser
    }
    async removeToken(refreshToken) {
        const tokenData = await TokenModele.deleteOne({refreshToken})
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await TokenModele.findOne({refreshToken})
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.DB_JW_ACCESS);
            return userData;
        } catch(e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.DB_JW_REFRESH)
            return userData;
        } catch(e) {
            return null;
        }
    }
}

export default new tokenService();