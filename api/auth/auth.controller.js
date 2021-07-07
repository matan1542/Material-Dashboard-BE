const authService = require('./auth.service')
const jwt = require("jsonwebtoken")
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id
            },
            process.env.SECRET_JWT,
            {
                expiresIn: "1h"
            }
        );
        // req.session.user = user
        res.status(200).json({
            message: "Auth successful",
            token
        })
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { email, username, password, firstName, lastName, city, country, postalCode, aboutMe, company } = req.body
        // Never log passwords
        console.log(req.body)
        // logger.debug(fullname + ', ' + username + ', ' + password)
        const account = await authService.signup(email,username, password, firstName, lastName, city, country, postalCode, aboutMe, company)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}