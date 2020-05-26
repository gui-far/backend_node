const router = require('express').Router();

const { getInvite, postInvite, patchInvite, deleteInvite } = require('../controllers/invites')

router.get('/', getInvite);         //Here you can get the Invitations
router.post('/', postInvite);       //Here you can invite an User
router.patch('/', patchInvite);     //Here you can modify (cancel or accept) Invitations
router.delete('/', deleteInvite);   

module.exports = router;