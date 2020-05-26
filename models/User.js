var bcrypt = require('bcryptjs');

module.exports = (sequelize, type) => {

    const User = sequelize.define('user', {
        email: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: type.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            afterValidate: function (user) {
                user.password = bcrypt.hashSync(user.password, 8)
                console.log("teste1");
                console.log(user.password);
            }
        }
    })

    return User

}