const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route working');
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
