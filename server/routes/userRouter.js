const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration',userController.registration);
router.post('/login',userController.login);
router.post('/logout', userController.logout);
router.get('/refresh',userController.refresh);
router.get('/auth',userController.check);
router.get('/activate/:link',userController.activate);

module.exports = router;