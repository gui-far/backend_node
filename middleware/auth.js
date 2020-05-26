const jwt = require('jsonwebtoken')
const { CompanyMember } = require('../database/sequelize')
const { ignoredPaths } = require('../config/ignoredPaths')

//Get userId from Token
const getUserId = (userToken) => {

    const decoded = jwt.verify(userToken, 'batatafrita2019')

}

//Create Token from userId
const getUserToken = (userId) => {

    return jwt.sign({ id: userId }, 'batatafrita2019', { expiresIn: '1d' })

}

//Check if the passwords match
const validateUserPassword = async (p1, p2) => {

    return await bcrypt.compare(p1, p2)

}

//Token Validation
const validateUserToken = (req, res, next) => {

    //Some output to help debug
    console.log("*** LOG AUTH *** - Path acessado = " + req.originalUrl)

    //ignoredPaths.js is use here, In some cases it is not necessary to validate the token
    if (ignoredPaths.indexOf(req.originalUrl) > -1) {

        return next()

    }

    //Hold Token from JSON request
    const token_header = req.headers.auth

    //IF - No token
    if (!token_header) return res.status(400).send({ error: 'Token não enviado!' })

    jwt.verify(token_header, 'batatafrita2019', async (err, decoded) => {

        //IF - Invalid Token
        if (err) return res.status(400).send({ error: 'Token invalido' })

        //Set the userID inside "locals" (For the current request)
        res.locals.auth_data = {}
        res.locals.auth_data.userId = decoded.id

        //Set the userRole inside "locals" (when he belongs to a company) (For the current request)
        const member = await CompanyMember.findOne({ where: { userId: decoded.id } })
        if (member) {
            res.locals.auth_data.role = member.role
            res.locals.auth_data.companyId = member.companyId
        }

        //Some outputs to help debug
        console.log("*** LOG AUTH *** - userId = " + res.locals.auth_data.userId)
        console.log("*** LOG AUTH *** - companyId = " + res.locals.auth_data.companyId)
        console.log("*** LOG AUTH *** - role = " + res.locals.auth_data.role)

        return next()

    })
}

module.exports = { getUserId, getUserToken, validateUserPassword, validateUserToken }
