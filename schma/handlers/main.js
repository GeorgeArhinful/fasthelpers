const bcrypt = require('bcrypt');
const LogModel = require('./../main/log')
const jwt = require('jsonwebtoken')
const SECRET = require('./../../config/auth')

const {
    SALT_ROUND = '1000'
}  = process.env


function convertNameToLowerCase(){


}


module.exports.encryptPassword = function(next){
    let  newpassword = SECRET.PASSWORD_SALT_LEFT + this.password + SECRET.PASSWORD_SALT_RIGTH
    bcrypt.genSalt(10 , (err , salt) => {
        if (err) return null  ;
        bcrypt.hash(newpassword , salt , (err , hash)=>{
            if (err) return null ; 
            this.password =  hash
            this.firstName = this.firstName.toLowerCase()
            this.lastName = this.lastName.toLowerCase()
            if(this.middleName) this.middleName = this.middleName.toLowerCase();
            next()

        })
    })
}




module.exports.decryptPassword = function(userPassword, res){
    // TODO : 
    // Add charaters to the userpassword and encript it
    let  newpassword = SECRET.PASSWORD_SALT_LEFT + userPassword + SECRET.PASSWORD_SALT_RIGTH
    return bcrypt.compare(newpassword ,this.password,(err,hashed)=>{
        if(err) return console.log(err)
        if(hashed){
            let log = new LogModel({userId: this._id})
            let logId = log._id
            // >>>>> SAVING THE TIME THE USER LOGEG IN TO THE DATABASE<<<<<<
            log.save((err , log)=>{
                if(err) return res.send(500,{success: false, message:'Try to login again in a few minte',err,response:null});    
                jwt.sign({logId},SECRET.JWT_SECRET_KEY,(err,token)=>{
                    (err)=>{
                        // <<<<< TODO: ERROR HANDLER
                        console.log(err);
                    }
                    console.log(token);
                return res.send(200,{cookie:token, success: true, message:'user login successful',err:null,response:this,logId});                            
                })            
            })
        }else{
            res.send(201,{success: false, message:'incorrect user name or password',err:null,response:null});                
        }
        return hashed
    })
}

module.exports.convertNameToLowerCase = convertNameToLowerCase