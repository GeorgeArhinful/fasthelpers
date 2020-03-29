const express = require('express')
const settings = require('./../handlers/settings')
const settingsRoute = express.Router()

settingsRoute.post('/update/profile' , settings.updateProfile);
settingsRoute.post('/update/account', settings.updateAccount);
settingsRoute.post('/update/nextofkin', settings.updateNextOfKin)
// settingsRoute.post('/update/profile/image' , setttings.updateProfileImage)


module.exports = settingsRoute