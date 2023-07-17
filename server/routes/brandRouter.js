const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/CheckRoleMiddlware');

router.post('/', checkRole('ADMIN'), brandController.create);
router.delete('/', checkRole('ADMIN'), brandController.delete);
router.put('/', checkRole('ADMIN'), brandController.update);
router.get('/', brandController.getAll);

module.exports = router;