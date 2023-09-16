const { Review, User, Device } = require('../models/models');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/tokenService')
const { Op } = require("sequelize");

class ReviewController {
    async create(req, res, next) {
        try {
            const { name, review, grade, deviceId, email } = req.body;
            const user = await User.findOne({ where: { email } });
            const checkReview = await Review.findOne({ where: { deviceId, userId: user.id } });
            if (checkReview) {
                throw ApiError.badRequest(`Пользователь с email - ${email} уже оставлял отзыв`);
            }

            const device = await Device.findByPk(deviceId);
            device.rating = device.rating + (grade - device.rating) / (device.reviewsCount + 1);
            device.reviewsCount += 1;
            await device.save();

            const reviewData = await Review.create({ name, review, email, grade, deviceId, userId: user.id });
            return res.json(reviewData);
        } catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const review = await Review.findByPk(id);
            if (!review) {
                throw ApiError.badRequest(`Отзыва с id - ${id} не существует`);
            }

            const authorizationHeader = req.headers.authorization;
            const accessToken = authorizationHeader.split(' ')[1];
            const userData = tokenService.validateAccessToken(accessToken);

            if (userData.role === 'USER' && review.userId !== userData.id) {
                throw ApiError.forbidden('Нет доступа');
            }

            const device = await Device.findByPk(review.deviceId);
            if (device.reviewsCount === 1) {
                device.rating = 0;
                device.reviewsCount = 0

            } else {
                device.rating = (device.rating * device.reviewsCount - review.grade) / (device.reviewsCount - 1);
                device.reviewsCount -= 1;
            }
            await device.save();

            await review.destroy();
            return res.json(review);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const { deviceId } = req.params;
            const { limit = 10, page = 1 } = req.query;
            let offset = limit * page - limit;

            const reviews = await Review.findAndCountAll({
                attributes: ['id', 'name', 'review', 'grade', 'updatedAt', 'deviceId'],
                where: { deviceId },
                limit, offset
            });
            return res.json(reviews);
        } catch (e) {
            next(e);
        }
    }
    async getOne(req, res, next) {
        try {
            const { userId, deviceId } = req.query;
            const condition = [
                deviceId ? { deviceId } : null,
                userId ? { userId } : null
            ]
            const review = await Review.findOne({
                attributes: ['id', 'name', 'review', 'grade', 'updatedAt', 'deviceId'],
                where: {
                    [Op.and]: condition
                }
            })
            return res.json(review);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id, name, review, grade } = req.body;
            const myReview = await Review.findByPk(id);
            if (!myReview) {
                throw ApiError.badRequest(`Отзыва с id - ${id} не существует`);
            }

            if (name)
                myReview.name = name;
            if (review)
                myReview.review = review;
            if (grade) {
                const device = await Device.findByPk(myReview.deviceId);
                device.rating = (device.rating * device.reviewsCount - myReview.grade + grade) / device.reviewsCount
                myReview.grade = grade;
                await device.save();
            }
            await myReview.save();
            return res.json(myReview);

        } catch (e) {
            next(e);
        }
    }

}

module.exports = new ReviewController();