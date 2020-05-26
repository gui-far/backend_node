const { Company, CompanyMember, User } = require('../database/sequelize');

//Get company Members
async function getCompanyMembers(req, res) {

    try {
        //Get data from Company and User Through companyMembers
        //This is possible because the CompanyMember model have a reference to Company and User through the "id" column
        let companyMembers = await Company.findAll({attributes: ['id', 'name'], include: [{ model: User, attributes: ['id', 'email'], through: { attributes: ['role', 'status'] } } ] } );

        //Sequelize will find the correct data and create a suitable JSON
        res.json(200,{ message: companyMembers })

    } catch (err) {

        res.json({ error: "ERROR - GET - COMPANYMEMBERS: " + err });

    }

}

//This method was created, but it is not being used on any route.
//Pois a maneira de adicionar um usuário à empresa é através do convite.
//Once the invited user ACCEPTS the invitation, it will belong to the company.
async function postCompanyMember(req, res) {

    //Retrieve some data from locals (These variables were defined inside auth.js)
    const { userId, companyId, role } = res.locals.auth_data;
    const { newMemberRole, newMemberStatus } = req.body;

    //Check if have all the data
    if (!userId || !newMemberEmail) {

        return res.json({ error: 'Insufficient data' });

    }

    //Check if the user is the company Administrator
    if (role != "A") {

        return res.json({ error: "You re not the companys Administrator" });

    }

    try {

        //Find the user/e-mail 
        const user = await User.findOne({ where: { email: newMemberEmail } });
        
        //Check if the email/user exists
        if (!user) {

            return res.json({ error: "E-mail/user not found" });

        }

        //Find member with the userId
        const member = await CompanyMember.findOne({ where: { userId: user.id } });

        //If the user is a member
        if (member) {

            //Check if user is already member of the current request administrator company
            if (member.companyId == companyId) {

                return res.json({ error: "User already belongs to your company" });

            } else {

                return res.json({ error: "User belongs to another company" });

            }

        }

        //Create the member with role 'U' (User) and status 'A' (Active)
        await CompanyMember.create({ companyId: companyId, userId: user.id, role: 'U', status: 'A' });

        //return true if successful
        return res.json({ message: true })

    } catch (err) {

        res.send({ error: "ERROR - POST - COMPANYMEMBER: " + err });

    }

}

//Update Company Member (Here you can set an user as a company administrator)
async function patchCompanyMember(req, res) {

    //Retrieve some data from locals (These variables were defined inside auth.js)
    const { userId, companyId, role } = res.locals.auth_data;
    const { companyMemberId, newMemberRole, newMemberStatus } = req.body;

    //If some of the follow data isn't defined
    if (!userId || !newMemberEmail || !companyMemberId || !role ||(!newMemberRole && !newMemberStatus) ) {

        return res.json({ error: 'Insufficient data' });

    }

    //If the new role isn't 'A' (Administrator) or 'U' (User) or the status isn't A (Active) and 'I' Invited
    if( (newMemberRole != 'A' && newMemberRole != 'U') || (newMemberStatus != 'A' && newMemberStatus != 'I') ) {
        return res.json({ error: "Invalid role or status" });
    }

    //If current user isn't the company Administrator
    if (role != "A") {
        return res.json({ error: "You are not a Company Administrator" });
    }

    try {

        //I'm developing this now...
        if(newMemberStatus == 'A') {

            let companyAdministrators = await Invite.findAll({ where: { companyId: companyId } });

            console.log("TESTEAQUI:" + companyAdministrators);

            //await CompanyMember.update({ role: 'A'}, { where: { userId: userId, id: inviteId } });

        }

        return res.json({ message: true })

    } catch (err) {

        res.send({ error: "ERROR - PATCH - COMPANYMEMBER: " + err });

    }

}

module.exports = { postCompanyMember, getCompanyMembers }