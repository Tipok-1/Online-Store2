const {User, Basket} = require('../models/models');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');

class UserService {
    async registration(email, password, role){
        const candidate = await User.findOne({where:{email}});
        if(candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        } 
        const hashPasword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4();
        const user = await User.create({email, role, password: hashPasword, activationLink});
        const basket = await Basket.create({userId: user.id})
        await mailService.sendActivationMail(user.email, `${process.env.API_URL}/api/activate/${activationLink}`)
            .catch(err=>{throw ApiError.badRequest('Ошибка при отправке сообщения для авторизации ' + err.message)})

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new UserService();