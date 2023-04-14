module.exports = class ApiError extends Error{
    constructor(status, message,errors = []) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    static badRequest(message, errors = []) {
        return new ApiError(404, message, errors)
    }
    // Внутренняя ошибка
    static internal(message) {
        return new ApiError(500, message)
    }
    //Доступа нет
    static forbidden(message) {
        return new ApiError(403, message)
    }
    //Не авторизован
    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован");
    }
}