const UserService = require('../service/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError')

class UserController {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw ApiError.badRequest("Ошибка при валидации", errors.array());
            }
            const {email, password, role} = req.body;
            const userData = await UserService.registration(email, password, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch(e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch(e) {
            next(e);
        }
    }

    async logout(req, res) {
        
    }

    async activate(req, res, next) {
        try{
            console.log('1111')
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch(e) {
            next(e);
        }
        
    }

    async check(req, res) {
        
    }

    async refresh(req, res) {
        
    }
}

module.exports = new UserController();