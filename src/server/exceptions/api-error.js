class ApiError extends Error {
    message;
    status;
    error;

    constructor(status, message, error) {
        super(message);
        this.status = status
        this.error = error
    }
    
        static unAuthError() {
            return new ApiError(401, 'Пользователь не авторизован');
        }
    
        static BadRequest(message, error=[]) {
            return new ApiError(message, error)
        }
}

export default new ApiError();