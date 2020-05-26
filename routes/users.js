const router = require('express').Router();

const { postUser, postAuth } = require('../controllers/users');

router.post('/', postUser);         //You can create a new user here
router.post('/auth', postAuth);     //You can check if you have a valid token

module.exports = router;