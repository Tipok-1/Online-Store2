const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/CheckRoleMiddlware');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.post('/deviceInfo/:deviceId', checkRole('ADMIN'), deviceController.createInfo);
router.put('/', checkRole('ADMIN'), deviceController.update);
router.delete('/:id', checkRole('ADMIN'), deviceController.delete);
router.delete('/deviceInfo/:id', checkRole('ADMIN'), deviceController.deleteInfo);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);

module.exports = router;