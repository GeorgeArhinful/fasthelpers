const express = require('express')
const settings = require('./../handlers/settings')
const level = require('./../handlers/levelUpdate')

const settingsRoute = express.Router()

settingsRoute.post('/update/profile' , settings.updateProfile);
settingsRoute.post('/update/account', settings.updateAccount);
settingsRoute.post('/update/nextofkin', settings.updateNextOfKin);
// settingsRoute.get('/level', level.updateLevel);
settingsRoute.post('/level/initiate', level.initiateLevelCount);



// settingsRoute.post('/update/profile/image' , setttings.updateProfileImage)


module.exports = settingsRoute