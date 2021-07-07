const userService = require('./user.service')
// const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const jwt = require('jsonwebtoken')

async function getUser(req, res) {
    try {
        const decoded = jwt.verify(req.params.token,process.env.SECRET_JWT)
        const user = await userService.getById(decoded.userId)
        res.status(200).send(user)
    } catch (err) {
        // logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}
async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        const token = jwt.sign(
            {
                email: savedUser.email,
                userId: savedUser._id
            },
            process.env.SECRET_JWT,
            {
                expiresIn: "1h"
            }
        );
        res.status(200).json({
            message: "Auth successful",
            token
        })
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    updateUser
}