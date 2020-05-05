const mongoose = require('mongoose');
// const main = require('./../handlers/main')

const Schema = mongoose.Schema

const unpayedSchema = new Schema({
    userId: {
        type : Schema.Types.ObjectId,
        ref : 'Users',
    },
    portal: {
        type : Number,
        required: true
    },
    level: {
        type : Number,
        required: true
    },
    paid:{
        type:Boolean,
        default: false,
    },
    amount:{
        type: Number,
        default: 0,
    },
    createdOn:{
        type: Date,
        default: Date.now(),
    },
})

const UnpayedModel = mongoose.model('unpayed', unpayedSchema)

module.exports = UnpayedModel