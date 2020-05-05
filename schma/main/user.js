const mongoose = require('mongoose');
const main = require('./../handlers/main')
const bcrypt = require('bcrypt')

const {
    SALT_ROUND = 100
} = process.env


const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        require: true,
        type: String
    },
    lastName: {
        require: true,
        type: String
    },
    middleName: {
        type: String,
        default: null
    },
    password: {
        require: true,
        type: String
    },
    userName: {
        default: null,
        type: String,
    },
    email: {
        require: true,
        type: String,
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        default: null
    },
    country: String,
    region: String,
    town: String,
    number: String,
    portal: {
        type: Number,
        default: 1
    },
    level: {
        type: Number,
        default: 0
    },
    // referral : {
    //     type : Schema.Types.ObjectId,
    //     ref : 'Users',
    // },
    // referrals: [{
    //     type : Schema.Types.ObjectId,
    //     ref: 'Users'
    // }],
    date: {
        type: String,
        default: Date.now()
    },
    createdOn: {
        type: String,
        default: Date.now()
    },
    url: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        default: 'member'
    },
    nextOfKin: {
        type: Schema.Types.ObjectId,
        ref: 'NextOfkin',
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    accountSet: {
        type: Boolean,
        default: false,
    },
    setNextOfKin: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },
    nextPortal:{
        type:Schema.Types.ObjectId
    },
    uniqueKey:{
        type: String,
        require: true
    }
});



userSchema.pre('save', main.encryptPassword);
userSchema.pre('save', main.encryptUniqueKey)



userSchema.methods.decrypt = main.decryptPassword;
userSchema.methods.decryptKey = main.decryptKey



let UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;