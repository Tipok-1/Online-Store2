const {Type} = require('../models/models')

class TypeController {
    async create(req, res, next) {
        try{
            const {name} = req.body;
            const type = await Type.create({name});
            return res.json(type);

        } catch(e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try{
            const types = await Type.findAll();
            return res.json(types);
        } catch(e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try{
            const {id} = req.body;
            const typeData = await Type.destroy({where: {id}});
            return res.json(typeData);
        } catch(e) {
            next(e);
        }
    }

    async update(req, res, next){
        try{
            const {id, name} = req.body;
            const typeData = await Type.update({name:name},{where: {id}});
            return res.json(typeData);
        } catch(e) {
            next(e);
        }
    }

}

module.exports = new TypeController();