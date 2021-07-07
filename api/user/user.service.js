const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')

module.exports = {
    getById,
    getByEmail,
    update,
    add

}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByEmail(email) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ email })
        return user
    } catch (err) {
        logger.error(`while finding user ${email}`, err)
        throw err
    }
}

async function update(userData) {
    const {user} = userData
    const saltRounds = 10
    try {
        const hash = await bcrypt.hash(user.password, saltRounds)
        // peek only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            email: user.email,
            password: hash,
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            country: user.country,
            postalCode: user.postalCode,
            aboutMe: user.aboutMe
        }
        console.log('newUser',userToSave._id)
        const collection = await dbService.getCollection('users')
       const newUser = await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            country: user.country,
            company: user.company,
            postalCode: user.postalCode,
            aboutMe: user.aboutMe
        }
        const collection = await dbService.getCollection('users')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}


