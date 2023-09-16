const {Brand} = require('../models/models')

class BrandController {
    async create(req, res, next) {
        try{
            const {name} = req.body;
            const brand = await Brand.create({name});
            return res.json(brand);

        } catch(e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try{
            const brands = await Brand.findAll();
            return res.json(brands);
        } catch(e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try{
            const {id} = req.body;
            const brandData = await Brand.destroy({where: {id}});
            return res.json(brandData);
        } catch(e) {
            next(e);
        }
    }

    async update(req, res, next){
        try{
            const {id, name} = req.body;
            const brandData = await Brand.update({name:name},{where: {id}});
            return res.json(brandData);
        } catch(e) {
            next(e);
        }
    }

}

module.exports = new BrandController();