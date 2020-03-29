const mongoose = require('mongoose');
// const main = require('./../handlers/main')

const Schema = mongoose.Schema

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    dateDeleted: {
        type: Date,
        default: null,
    },
    momoNumber: {
        type: String,
        default: ''
    },
    bankName: {
        type: String,
        default: ''
    },
    branch:{
        type: String,
        default: ''
    },
    accountNumber: {
        type: String,
        default: ''
    },
    accountName: {
        type: String,
        default: ''
    },
    networkService:{
        type: String,
        default: ''
    }
})

const AccountModel = mongoose.model('Account', accountSchema)

module.exports = AccountModel