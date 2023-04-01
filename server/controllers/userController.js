const UserService = require('../service/userService');

class UserController {
    async registration(req, res, next) {
        try{
            const {email, password, role} = req.body;
            const userData = await UserService.registration(email, password, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch(e) {
            next(e);
        }
    }

    async login(req, res) {
        
    }

    async logout(req, res) {
        
    }

    async activate(req, res) {
        
    }

    async check(req, res) {
        
    }

    async refresh(req, res) {
        
    }
}

module.exports = new UserController();