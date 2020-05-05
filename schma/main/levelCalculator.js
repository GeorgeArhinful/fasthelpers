const mongoose = require('mongoose');
// const main = require('./../handlers/main')

const Schema = mongoose.Schema

const levelSchema = new Schema({
    prevLevel: {
        type : Number,
        default : 1,
    },
    level: {
        type : Number,
        default : 3,
    },
    prevPeople: {
        type : Number,
        default: 0
    },
    currentPeople: {
        type: Number,
        default: 3,
    },
    levelOverflow: {
        type: Number,
        default: 0
    }
})


const levelModel = mongoose.model('level', levelSchema)

module.exports = levelModel