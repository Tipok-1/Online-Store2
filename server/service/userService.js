const {User} = require('../models/models');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');

class UserService {
    async registration(email, password){
        const candidate = await User.findOne({where:{email}});
        if(candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        } 
        const hashPasword = await bcrypt.hash(password, 3)
        const user = await User.create({email, password: hashPasword})
    }
}

module.exports = new UserService();