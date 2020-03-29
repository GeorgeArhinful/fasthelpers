const express = require('express')
const mails = require('./../handlers/mails');

const mailRoutes = express.Router()

mailRoutes.post('/contactUs', mails.contactUs)


module.exports = mailRoutes