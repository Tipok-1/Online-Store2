const {User, Basket} = require('../models/models');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');

class UserService {
    async MakeDtoAndTokens(user){
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens,user: userDto};
    }

    async registration(email, password, role){
        const candidate = await User.findOne({where:{email}});
        if(candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        } 
        const hashPasword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4();
        const user = await User.create({email, role, password: hashPasword, activationLink});
        const basket = await Basket.create({userId: user.id})
        await mailService.sendActivationMail(user.email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
            .catch(err=>{throw ApiError.badRequest('Ошибка при отправке сообщения для авторизации ' + err.message)})

        return await this.MakeDtoAndTokens(user);
    }

    async activate(activationLink){
        const user = await User.findOne({where:{activationLink}});
        if(!user) {
            throw new ApiError.badRequest(`Некоректная ссылка активации`);
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({where:{email}});
        if(!user) {
            throw ApiError.badRequest(`Пользователь с email - (${email}) не найден`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.badRequest(`Указан неверный пароль`);
        }
        return await this.MakeDtoAndTokens(user);
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        return await this.MakeDtoAndTokens(user);
    }
}

module.exports = new UserService();