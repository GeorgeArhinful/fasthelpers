const jwt = require('jsonwebtoken')
const UserModel = require('./../../schma/main/user');
const LogModel = require('./../../schma/main/log');
const SECRET = require('./../../config/auth');
const multer = require('multer');
const AccountModel = require('./../../schma/main/Account');
const NextOfkingsModel = require('./../../schma/main/nextOfKings');



module.exports.updateProfile = (req , res)=>{
    let {query , body} = req;
    console.log(body , query);
    
    jwt.verify(query.token,SECRET.JWT_SECRET_KEY,(err , hased)=>{
        if(err) return res.send(500,{success: false, message:'Decryption Failed',err,response:null}); 
        LogModel.findOne({_id:hased.logId},(err, log)=>{
            if(err) return res.send(500,{success: false, message:'finding log failed, try in a few minte DB OUT',err,response:null});                
            UserModel.findOneAndUpdate({_id:log.userId} ,{...body}, (err, update)=>{
                if(err) return res.send(500,{success: false, message:'updating failed, try in a few minte DB OUT',err,response:null});                
                return res.send(200,{success: true, message:'update Successfull',err,response:update,logId:hased.logId});                
            })
        })
    })

}


// SET STORAGE 
var storage = multer.diskStorage({  
    destination: function (req, file, cb) {    cb(null, 'uploads')  },  
    filename: function (req, file, cb) {    cb(null, file.fieldname + '-' + Date.now())  } 
    })
 
var upload = multer({ storage: storage });


upload.single('myFile'), (req, res, next) => {  
    const file = req.file  
    if (!file) {    const error = new Error('Please upload a file')    
    error.httpStatusCode = 400    
    return next(error)  }    res.send(file)  }


module.exports.updateProfileImage = upload



module.exports.updateAccount = (req, res)=>{
    let {body , query} = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY, (err, hased) => {
        if (err) return res.send(500, { success: false, message: 'Decryption Failed', err, response: null });
        LogModel.findOne({ _id: hased.logId }, (err, log) => {
            if (err) return res.send(500, { success: false, message: 'finding log failed, try in a few minte DB OUT', err, response: null });
            
            AccountModel.findOneAndUpdate({userId: log.userId }, { ...body }, (err, update) => {
                if (err) return res.send(500, { success: false, message: 'updating failed, try in a few minte DB OUT', err, response: null });
                return res.send(200, { success: true, message: 'update Successfull', err, response: update, logId: hased.logId });
            })
        })
    })
}



module.exports.updateNextOfKin = (req, res) => {
    let { body, query } = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY, (err, hased) => {
        if (err) return res.send(500, { success: false, message: 'Decryption Failed', err, response: null });
        LogModel.findOne({ _id: hased.logId }, (err, log) => {
            if (err) return res.send(500, { success: false, message: 'finding log failed, try in a few minte DB OUT', err, response: null });

            NextOfkingsModel.findOneAndUpdate({ ownerId: log.userId }, { ...body }, (err, nextOfKin) => {
                if (err) return res.send(500, { success: false, message: 'updating failed, try in a few minte DB OUT', err, response: null });
                return res.send(200, { success: true, message: 'update Successfull', err, response: nextOfKin, logId: hased.logId });
            })
        })
    })
}