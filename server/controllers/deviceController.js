const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');
const { Op, Sequelize } = require("sequelize");
const imageService = require('../service/imageService');

class DeviceController {
    async create(req, res, next) {
        try{
            let {name, price, brandId, typeId, info, description, stock, rating, reviewsCount} = req.body;
            const images = imageService.createImages(req.files);
            const device = await Device.create({name, price, brandId, typeId, img:images, description, stock, rating, reviewsCount});

            if(info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    }) //добавляем асинхронно без await 
                });
            }
            return res.json(device);
        } catch(e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try{
            let {brandId, typeId, limit = 9, page = 1, search = '', minPrice = null, maxPrice = null, IDs = null} = req.query;
            let offset = limit * page - limit;
            let devices;
            if(brandId) {
                brandId = JSON.parse(brandId);
            }

            if(IDs) {
                IDs = JSON.parse(IDs);
            }

        const condition = [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {[Op.like]: `%${search.toLowerCase()}%`}),
            !minPrice ? {} : {price: { [Op.gte]: minPrice}},
            !maxPrice ? {} : {price: { [Op.lte]: maxPrice}},
            (!brandId)? {} : {brandId},//[Sequelize.Op.in]:brandId
            !typeId ? {} : {typeId},
            (!IDs) ? {} : {id: IDs}
            
        ]
            
            devices = await Device.findAndCountAll({
            
                where: {
                [Op.and]: condition
            },limit, offset});

              devices.maxPrice = await Device.max('price', {where:{[Op.and]: condition}});
              devices.minPrice = await Device.min('price', {where:{[Op.and]: condition}});

            return res.json(devices);

        } catch(e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try{
            const {id} = req.params;
            const device  = await Device.findOne({
                where:{id},
                include:[{model:DeviceInfo, as: 'info'}]
            })
            
            return res.json(device);
        } catch(e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try{
            const {id} = req.params;
            const device  = await Device.findOne({where:{id}})

            DeviceInfo.destroy({where:{deviceId: device.id}}); //удаляем асинхронно без await 
            imageService.deleteImages(device.img);
            const deviceData  = await device.destroy();

            return res.json(deviceData);
        } catch(e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try{
            let {id, deleteImages, ...changedField} = req.body;

            const device = await Device.findByPk(id);
            if(!device) {
                throw ApiError.badRequest(`Продукта с ID - ${id} не существует`);
            }
            
            let deviceImages = [...device.img];
            if(deleteImages) {
                deleteImages = JSON.parse(deleteImages);
                imageService.deleteImages(deleteImages);
                deviceImages = deviceImages.filter(img=>{
                    for(let i = 0; i <deleteImages.length; i++) {
                        if(img === deleteImages[i]) {
                            return false
                        }
                    }
                    return true;
                })
            }

            if(req.files) {
                const newImages = imageService.createImages(req.files);
                deviceImages = deviceImages.concat(newImages);
            }
            if(req.files || deleteImages) {
                device.img = deviceImages
            }

            let fields = Object.keys(changedField);
            for(let i = 0; i<fields.length; i++) {
                if(fields[i] == 'info') {
                    const info = JSON.parse(changedField[fields[i]]);
                    await Promise.all(
                        info.map( i=> DeviceInfo.update({title:i.title, description:i.description},{where: {id:i.id}}))
                    )
                }
                else if(fields[i] in device) {
                    device[fields[i]] = changedField[fields[i]];
                }
            }

            await device.save();

            let deviceWithInfo = await Device.findOne({
                where:{id},
                include:[{model:DeviceInfo, as: 'info'}]
            })
            
            return res.json(deviceWithInfo);
        } catch(e) {
            next(e);
        }
    }

    async createInfo(req, res, next){
        try{
            const {deviceId} = req.params;
            let {info} = req.body;
            if(info) {
                //info = JSON.parse(info);
                await Promise.all(
                    info.map(i => {
                    return DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: deviceId
                    }) 
                }));
            }
            let deviceWithInfo = await Device.findOne({
                where:{id:deviceId},
                include:[{model:DeviceInfo, as: 'info'}]
            })
            
            return res.json(deviceWithInfo);
        } catch(e) {
            next(e);
        }
    }
    async deleteInfo(req, res, next){
        try{
            const {id} = req.params;
            let info = await DeviceInfo.findByPk(id);
            let deviceId  = info.deviceId;
            await info.destroy();
            let deviceWithInfo = await Device.findOne({
                where:{id:deviceId},
                include:[{model:DeviceInfo, as: 'info'}]
            })
            
            return res.json(deviceWithInfo);

        } catch(e) {
            next(e);
        }
    }
}


module.exports = new DeviceController();