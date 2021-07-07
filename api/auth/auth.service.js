const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)

    const user = await userService.getByEmail(email)
    console.log(`auth.service - user `,user)
    if (!user) return Promise.reject('Invalid email or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')
    delete user.password
    return user
}

async function signup(email, password, fullname) {
    const saltRounds = 10
    const user = await userService.getByEmail(email)
    logger.debug(`auth.service - signup with email: ${email}, fullname: ${fullname}`)
    if (!email || !password || !fullname) return Promise.reject('fullname, username and password are required!')
    if(user.email === email) return Promise.reject('Email address exist already')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ email, password: hash, fullname })
}

module.exports = {
    signup,
    login,
}