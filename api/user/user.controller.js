const userService = require('./user.service')
// const socketService = require('../../services/socket.service')
// const logger = require('../../services/logger.service')

async function onSignUp(req, res) {
    const userInfo = req.body
    try {
        const user = await userService.add(userInfo)
        req.session.loggedinUser = user;
        res.send(user)
    } catch (err) {
        res.status(403).send('Invalid info')
    }
}
async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        // logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}


async function onLogin(req, res) {
    console.log('api login')
    const credentials = req.body
    try {
        const user = await userService.checkLogin(credentials);
        if (user) {
            req.session.loggedinUser = user;
            res.send(user)
        } else {
            res.status(403).send('Invalid username / password')
        }
    } catch (err) {
        throw err;
    }


}
async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    onSignUp,
    onLogin,
    updateUser
}