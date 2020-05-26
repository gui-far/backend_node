module.exports = (sequelize, type) => {

    const CompanyMember = sequelize.define('companyMember', {
        companyId: {
            type: type.INTEGER,
            references: { model: 'Companies', key: 'id' }
        },
        userId: {
            type: type.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        role: {
            type: type.STRING
        },
        status: {
            type: type.STRING
        }
    })

    return CompanyMember

}
