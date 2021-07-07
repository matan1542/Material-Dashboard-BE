const express = require('express')
const {requireAuth} = require('../../middlewares/requireAuth.middleware')
const { getUser, updateUser } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router

router.get('/:token', getUser)
router.put('/:id',  requireAuth, updateUser)

module.exports = router