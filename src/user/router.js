const router = require('express').Router();
const { getAllUser } = require('./controller');
const { auth } = require('../middlewares/authMiddleware');

router.get('/', auth, getAllUser);

module.exports = router;