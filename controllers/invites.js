const { Company, Invite, User, CompanyMember } = require('../database/sequelize')

const Op = require('sequelize').Op

//Here you can get the Invitation (behaves differently for user and administrator)
async function getInvite(req, res) {

    //Get data from locals (defined inside auth.js)
    const { userId, companyId, role } = res.locals.auth_data;

    if (!userId) {
        return res.json({ error: 'Insufficient data' });
    }

    try {
        //If user has company, bot isn't an Administrator, he can only be an User
        if (companyId && role != 'A') {

            return res.json({ error: 'You already belong to a company and therefore cannot receive invitations'});

        }

        //If dont have role, the user will get the all invitations (Company Name) that other companies sent to him
        if (role == undefined) {

            let invite = await User.findOne({attributes: ['id', 'email'],  where: { id: userId }, include: [{ model: Company, attributes: ['id', 'name'], through: { attributes: ['id', 'status', 'createdAt'] } } ] });
            return res.json({ message: invite });

        }

        //If you are an administrator you will get all invitations (User Email) sent to users
        if (role == 'A') {

            let invite = await Company.findOne({attributes: ['id', 'name'],  where: { id: companyId }, include: [{ model: User, attributes: ['id', 'email'], through: { attributes: ['id', 'status', 'createdAt'] } } ] });
            return res.json({ message: invite });

        }

    } catch (err) {

        res.send({ error: 'ERROR - GET - INVITE: ' + err });

    }

}

//Here you can Invite a User
//I'm developing this now...
async function postInvite(req, res) {

    //Get data from locals (defined inside auth.js)
    const { userId, companyId, role } = res.locals.auth_data;
    const { newMemberEmail } = req.body;

    if (!userId || !newMemberEmail) {

        return res.json({ error: 'Insufficient data' });

    }

    //If you're an Administrator you cannot invite
    if (role != 'A') {

        return res.json({ error: 'You re not the companys Administrator' });

    }

    try {

        const user = await User.findOne({ where: { email: newMemberEmail } });

        //If user dont exists
        if (!user) {

            return res.json({ error: 'Email / user not found' });

        }

        const member = await CompanyMember.findOne({ where: { userId: user.id } });

        //Check if user is a member
        if (member) {

            //If user is a member of yo company
            if (member.companyId == companyId) {

                return res.json({ error: 'User already belongs to your company' });

            } else { //Or is a member of other company

                return res.json({ error: 'User belongs to another company' });

            }

        }

        let invite = await Invite.findOne({where : { userId: user.id, status: { [Op.ne]: 'C' } } });

        if (invite) {

            if (invite.companyId == companyId) {

                return res.json({ error: 'User has already been invited by your company, please wait' });

            }

        }

        invite = await Invite.create({ companyId: companyId, userId: user.id, status: 'P' });

        return res.json({ message: true })

    } catch (err) {

        res.send({ error: 'ERRO - POST - INVITE: ' + err });

    }

}

//Accepts invite
async function patchInvite(req, res) {

    const { userId, companyId, role } = res.locals.auth_data;
    const inviteId = req.body.inviteId;

    if (!userId && !companyId && !role) {

        return res.json({ error: 'Insufficient Data' });

    }

    const invite = await Invite.findOne({ where: { id: inviteId } });

    if(!invite) {

        return res.json({ error: 'Cannot find Invite' });

    }

    try {

        //If user dont have companyId
        if (!companyId) {
            //Accepts invite for one company and reject all other
            await Invite.update({ status: 'A' }, { where: { userId: userId, id: inviteId } });
            await Invite.update({ status: 'R' }, { where: { userId: userId, id: { [Op.ne]: inviteId } } });

            const companyMember = await CompanyMember.create({ companyId: invite.companyId, userId: invite.userId, role: 'U', status: 'A' });

            return res.json({ message: true });

        }
        
        //If have company, and user is an administrator
        if (role == 'A') {
            //Cancel the invite
            await Invite.update({ status: 'C' }, { where: { id: inviteId } });
            return res.json({ message: true });    
        }

        return res.json({ message: 'You dont have permission to invite users.' });

    } catch (err) {

        res.send({ error: 'ERRO - PATCH - INVITE: ' + err });

    }

}

//NAO VAI DELETAR O REGISTRO, VAI ATUALIZAR O STATUS DO CONVITE PARA 'C'
async function deleteInvite(req, res) {

    const { userId, companyId, role } = res.locals.auth_data;
    const inviteId = req.body.inviteId;

    if (!userId || !companyId || !role) return res.json({ error: 'Dados insuficientes' });

    try {

        await Invite.update({ status: 'C' }, { where: { id: inviteId } });

        return res.json({ message: true });

    } catch (err) {

        res.send({ error: 'ERROR - DELETE - INVITE: ' + err });

    }
}

module.exports = { getInvite, postInvite, patchInvite, deleteInvite }