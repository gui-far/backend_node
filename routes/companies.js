const router = require('express').Router();

const { postCompany, patchCompany } = require('../controllers/companies');

router.post('/', postCompany);
router.patch('/', patchCompany);

module.exports = router;