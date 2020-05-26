const { Company, CompanyMember } = require('../database/sequelize');

//Here you can create a company
async function postCompany(req, res) {

    
    const { userId } = res.locals.auth_data;
    const { newCompanyName } = req.body;

    //Check if have all data
    if (!userId || !newCompanyName) {

        return res.send({ error: 'Insufficient data' });

    }

    try {

        //Check if the company name already exists
        if (await Company.findOne({ where: { name: newCompanyName } })) {

            return res.json({ error: "This company name is already in use" });

        }

        //Create the company - Also create the Company Member (as the company administrator)
        const company = await Company.create({ name: newCompanyName });
        const companyMember = await CompanyMember.create({ companyId: company.id, userId: userId, role: 'A', status: 'A' });

        //return truth if successful
        if (company && companyMember) {

            return res.json({ message: true });

        }


    } catch (err) {

        //Error output for debug
        res.send({ error: "ERROR - POST - COMPANY: " + err });

    }
}

//Here you can update the company Data (actually just the company's name)
async function patchCompany(req, res) {

    //Retrieve some data from locals (These variables were defined inside auth.js)
    //Get the new company name from JSON request
    const { userId, companyId, role } = res.locals.auth_data;
    const { newCompanyName } = req.body;

    //Check if have all the data
    if (!userId || !newCompanyName) {

        return res.json({ error: 'Insufficient data' });

    }

    //Check if the user belongs to the Company
    if (!companyId || !role) {

        return res.json({ error: 'You dont belong to any company' });

    }

    //Check if the user is the company Administrator
    if (role != 'A') {

        return res.json({ error: 'You re not the companys Administrator' });

    }


    try {

        //Check if the company name already exists
        if (await Company.findOne({ where: { name: newCompanyName } })) {

            return res.json({ error: "This company name is already in use" });

        }

        //Update the company name
        if (await Company.update({ name: newCompanyName }, { where: { id: companyId } })) {

            //return true if successful
            return res.json({ message: true });

        }


    } catch (err) {

        res.json({ error: "ERROR - PATCH - COMPANY: " + err });

    }

}

module.exports = { postCompany, patchCompany }