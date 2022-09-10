import ApiError  from '../exceptions/api-error.js'
import tokenService from '../services/token-service.js';

export const authMiddleware = (req, res, next) => {
    try {  
        const authToken = req.headers.authorization;
        if (!authToken) {
            return next(ApiError.unAuthError());
        }
        const token = authToken.split(' ')[1];
        if (!token) {
            return next(ApiError.unAuthError());
        }
        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError.unAuthError());
        }
        req.user = userData;
        next();
    } catch(e) {
        return next(ApiError.unAuthError());
    }
}
