const uuid = require('uuid');
const path = require('path');
const fs = require('fs/promises');
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
    async create(req, res, next) {
        try{
            let {name, price, brandId, typeId, info} = req.body;
            const {img} = req.files;
            const fileName = uuid.v4() +'.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({name, price, brandId, typeId, img:fileName});

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
            let {brandId, typeId, limit, page} = req.query;
            page  = page || 1;
            limit = limit || 9;
            let offset = limit * page - limit;
            let devices;
            if(!brandId && !typeId) {
                devices = await Device.findAndCountAll({limit, offset});
            }
            if(brandId && !typeId) {
                devices = await Device.findAndCountAll({where:{brandId}, limit, offset});
            }
            if(!brandId && typeId) {
                devices = await Device.findAndCountAll({where:{typeId}, limit, offset});
            }
            if(brandId && typeId) {
                devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset});
            }
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
            const filePath = path.resolve(__dirname, '..', 'static', device.img);
            fs.unlink(filePath); //удаляем асинхронно без await 
            const deviceData  = await device.destroy();

            return res.json(deviceData);
        } catch(e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try{
            const {id, ...changedField} = req.body;
            const img = req.files ? req.files.img : null;
            const device = await Device.findByPk(id);
            if(!device) {
                throw ApiError.badRequest(`Продукта с ID - ${id} не существует`);
            }
            let fields = Object.keys(changedField);
            if(img) {
                const fileName = uuid.v4() +'.jpg';
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
                const filePath = path.resolve(__dirname, '..', 'static', device.img);
                fs.unlink(filePath); //удаляем асинхронно без await 
                device.img = fileName;
            }
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