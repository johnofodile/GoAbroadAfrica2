const router = require('express').Router();
const ctrl   = require('../controllers/programs');
const { protect, adminOnly } = require('../middleware/auth');
 
router.get('/countries', ctrl.getCountries);
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/',   protect, adminOnly, ctrl.create);
router.put('/:id', protect, adminOnly, ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);
 
module.exports = router;
 

