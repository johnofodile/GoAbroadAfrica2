const router= require('express').Router();
const ctrl=require('../controllers/experiences');
const {protect, adminOnly}= require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (no login needed)
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);
 
// Protected routes (must be logged in)
router.post('/', protect, upload.array('images', 5), ctrl.create);
router.delete('/:id', protect, ctrl.remove);
router.post('/:id/like',     protect, ctrl.toggleLike);
router.post('/:id/comments', protect, ctrl.addComment);

 
// Admin routes
router.patch('/:id/approve', protect, adminOnly, ctrl.approve);
 
module.exports = router;
 


