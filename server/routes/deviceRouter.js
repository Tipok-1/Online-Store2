const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/CheckRoleMiddlware');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.put('/', checkRole('ADMIN'), deviceController.update);
router.delete('/:id', checkRole('ADMIN'), deviceController.delete);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);

module.exports = router;