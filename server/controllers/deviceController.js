const uuid = require('uuid');
const path = require('path');
const {Device} = require('../models/models')

class DeviceController {
    async create(req, res, next) {
        try{
            const {name, price, brandId, typeId, info} = req.body;
            const {img} = req.files;
            const fileName = uuid.v4() +'.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({name, price, brandId, typeId, img:fileName});
            return res.json(device);
        } catch(e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try{
            
        } catch(e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try{
            
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new DeviceController();