const router = require('express').Router();

const { getCompanyMembers, postCompanyMember } = require('../controllers/companyMembers');

router.get('/', getCompanyMembers);
router.post('/', postCompanyMember);

module.exports = router;