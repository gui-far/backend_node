module.exports = (sequelize, type) => {

    const Company = sequelize.define('company', {
        name: { type: type.STRING, allowNull: false, unique: true }
    })

    return Company

}