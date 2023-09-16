const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController')
const checkAuth= require('../middleware/AuthMiddleware');

router.post('/', /*checkAuth,*/ reviewController.create);
router.delete('/:id', checkAuth, reviewController.delete);
router.patch('/', /*checkAuth,*/reviewController.update);
router.get('/:deviceId', reviewController.getAll);
router.get('/', reviewController.getOne);

module.exports = router;