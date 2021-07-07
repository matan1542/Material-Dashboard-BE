const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)
    const user = await userService.getByEmail(email)
    if (!user) return Promise.reject('Invalid email or password')
    const match = await bcrypt.compare(password, user.password)

    if (!match) return Promise.reject('Invalid email or password')
    delete user.password
    return user
}

async function signup(email, username, password, firstName, lastName, city, country, postalCode, aboutMe, company) {
    const saltRounds = 10
    if (!email || !password) return Promise.reject(' username and password are required!')
    //check if email is already in use
    try {
        const user = await userService.getByEmail(email)
        if (user.email === email) return Promise.reject('Email address already signed')
    }
    catch (err) {
        logger.debug(`auth.service - signup with email: ${email}`)
        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ email,username, password: hash, firstName, lastName, city, country, postalCode, aboutMe, company })
    }
}

module.exports = {
    signup,
    login,
}