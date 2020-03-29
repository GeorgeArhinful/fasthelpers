const mongoose = require('mongoose');
const main = require('./../handlers/main')
const bcrypt = require('bcrypt')

const {
    SALT_ROUND = 100
}  = process.env


const Schema = mongoose.Schema

const nextOfkingsSchema = new Schema({
    firstName :{
        require : true,
        type : String,
        default:'',

    },
    lastName : {
        require : true,
        type : String,
        default: '',
    },
    address : {
        type : String,
        default: null,
        default: '',
    },
    email : {
        require : true,
        type : String,
        default: '',
    },
    relation:String,
    day: String,
    month : String,
    year: String,
    number: String,
    country:{
        type: String,
        default: '',
    },
    region:{
        type: String,
        default: '',
    },
    town:{
        type: String,
        default: '',
    },
    residencialAddress: {
        type: String,
        default: '',
    }
    ,
    ownerId: {
        type : Schema.Types.ObjectId,
        ref : 'Users',
    },
    date : {
        type : String,
        default : Date.now() 
    },
    createdOn:{
        type : String,
        default : Date.now()
    },
})

let NextOfkingsModel =  mongoose.model('NextOfkin',nextOfkingsSchema)

module.exports = NextOfkingsModel