const mongoose = require('mongoose');
// const main = require('./../handlers/main')

const Schema = mongoose.Schema

const logSchema = new Schema({
    userId: {
        type : Schema.Types.ObjectId,
        ref : 'Users',
    },
    date: {
        type : Date,
        default : Date.now()
    },
    isDelete: {
        type : Boolean,
        default: false
    },
    dateDeleted:{
        type: Date,
        default: null,
    },
    exp:{
        type: Date,
        default: null
    }
})

const LogModel = mongoose.model('Logs',logSchema)

module.exports = LogModel