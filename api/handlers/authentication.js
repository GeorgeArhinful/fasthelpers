const nodeMailer = require('nodemailer')
const UserModel = require('./../../schma/main/user');
const LogModel = require('./../../schma/main/log');
const AccountModel = require('./../../schma/main/Account')
const jwt = require('jsonwebtoken');
const SECRET = require('./../../config/auth');
const MAILL = require('./../../config/mail');
const bcrypt = require('bcrypt');
const UnpayedModel = require('./../../schma/main/unpayed')
const random = require("random-key");

const NextOfkingsModel = require('./../../schma/main/nextOfKings');

let updateUserInfo = (obj , update)=>{
    let result = {
        success: false,
        msg: null
    }

    return result
}


module.exports.getPayment = function(req , res){
    let {query} = req
        jwt.verify(query.token, SECRET.JWT_SECRET_KEY,(err,result)=>{
        if(err) return res.send(500,{success: false, message:'cheaking user Failed',err,response:[]}); 
        LogModel.findOne({_id:result.logId} ,(err, log)=>{
            if(err) return res.send(500,{success: false, message:'finding log failed, try in a few minte DB OUT',err,response:[]});                
            UnpayedModel.find({userId: log.userId},(err,data)=>{
                if(err){
                     return res.send(500,{success: false, message:'Try to reload the page again in a few minte DB OUT',err,response:[]});                
                }else if(!data.length){
                    return res.send(401,{success: false, message:'incorrect user name or password',err:null,response:[]});                
                }else{
                    // check to see if password is valid 
                    return res.send(200,{success: true, message:'payment uploaded',err,response:data,logId:result.logId});                
                }
            })
        })

    })
} 




module.exports.getPortals = function(req , res){
    let {query} = req
        jwt.verify(query.token, SECRET.JWT_SECRET_KEY,(err,result)=>{
            if(err) return res.send(500,{success: false, message:'cheaking user Failed',err,response:[]}); 
            LogModel.findOne({_id:result.logId} ,(err, log)=>{
                if(err) return res.send(500,{success: false, message:'finding log failed, try in a few minte DB OUT',err,response:[]});                
                UserModel.find({ownerId: log.userId},(err,data)=>{
                if(err){
                     return res.send(500,{success: false, message:'Try to reload the page again in a few minte DB OUT',err,response:[]});                
                }else if(!data.length){
                    return res.send(401,{success: false, message:'incorrect user name or password',err:null,response:[]});                
                }else{
                    // check to see if password is valid 
                    return res.send(200,{success: true, message:'payment uploaded',err,response:data,logId:result.logId});                
                }
            })
        })

    })
} 





// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SIGNUP EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.register = function(req,res){
    let credencial = req.body;
    
    // TODO :
    // 1. validate input 
    // 1. check to see if no user with the same user name is in the database
    
                // <<<<<<<< Cheching to see if user has already signup >>>>>>>>
UserModel.findOne({userName: credencial.userName},(err,result)=>{
    if(err){
        return res.send(500,{success: false, message: 'Try to signup again in a few minte DB OUT',err, response : null});
    }else if (result !== null){
        return res.send(200,{success: false, message: 'the user name is been use by other user', err: null,response : null });
    }else{
        // 2. create an instants of the user
        let newUser = new UserModel({...credencial}); 
        let userId = newUser._id;              
        // 5. save user to database
        newUser.save((err,data)=>{
            // <<<<< TODO: ERROR HANDLER
            if(err) return console.log(err);  
            // 6. set cookies
            // 7. send response to user
            let log = new LogModel({ userId })
            let logId = log._id
            log.save((err, logInfo) => {
                // <<<<< TODO: ERROR HANDLER
                if (err) return res.send(200, { success: true, message: 'Signup Successfull but log not saved DB OUT', err, response: { ...data._doc,_id:userId}, logId });

                jwt.sign({ logId }, SECRET.JWT_SECRET_KEY, (err, token) => {
                    // <<<<< TODO: ERROR                       
                    (err) => console.log(err);
                    return res.send(200, { cookie: token, success: true, message: 'Signup Successfull', err, response: { ...data._doc, _id: userId }, logId });
                })
            })
        })

    }
}) 
}
        



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NEXT OF KING SIGNUP EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.nextOfkingSignUp  = (req , res) => {
    let {body} = req
    let newUser = new NextOfkingsModel({...body})
    let id = newUser._id
    newUser.save((err, kings)=>{
        if(err) return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});                
        UserModel.findOneAndUpdate({ _id: body.ownerId }, { setNextOfKin: true, nextOfKin: id,token:''} , (err, data)=>{
            
            if(err) return console.log(err);
            
            // res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});
            
            UserModel.findOne({_id:body.ownerId}, (err,userInfo)=>{
                
            if(err) return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});
                return res.send(200,{success: true, message:'Next Of KingSignUp Successfull',err,response: userInfo});                            
            })
        }) 
    })
}




module.exports.accoutSetUp = (req , res) => {
    let { body } = req
    let newAccountModel = new AccountModel({ ...body })
    let id = newAccountModel._id
    newAccountModel.save((err, account) => {
        if(err) return res.send(500, { success: false, message: 'Try to signup again in a few minte DB OUT', err, response: null });
        UserModel.findOneAndUpdate({ _id: body.userId }, { accountSet: true, account: id}, (err, data) => {
            if (err) return console.log(err);
            // res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});
            UserModel.findOne({ _id: body.userId }, (err, userInfo) => {

                if (err) return res.send(500, { success: false, message: 'Try to signup again in a few minte DB OUT', err, response: null });
                return res.send(200, { success: true, message: 'Accounting Successfull', err, response: userInfo });
            })
        })
    })
    
}




// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LOGIN EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.signin = (req, res) => {
    // TODO :
    // validat input
    let credencial = req.body
    
    // find user in database
    UserModel.findOne({userName:credencial.userName})
    .populate('referrals')
    .exec(function(err , user){
        if(err){
             return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});                
        }else if(user === null){
            return res.send(401,{success: false, message:'incorrect user name or password',err:null,response:null});                
        }else{
            // check to see if password is valid               
            return user.decrypt(credencial.password,res);
        }
    })
}



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LOGOUT EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.logOut = (req, res)=> {
    let {body , query} = req;
    let logId =  query.logId
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY,(err,result)=>{
        if(err) return res.send(500,{success: false, message:'Decryption Failed',err,response:null}); 

        LogModel.findOneAndUpdate({_id: result.logId},{dateDeleted: Date.now(), isDelete:true},(err , data)=>{
            if(err) return res.send(500,{success: false, message:'Try to logout again in a few minte DB OUT',err,response:null});                
            return res.send(200,{success: true, message:'Logout Successfull',err,response:{},logId:''});                
        })
})
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CHECK USER SIGNIN  EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.signinChecker = (req , res) => {
    let {query} = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY,(err,result)=>{
        if(err) return res.send(500,{success: false, message:'cheaking user Failed',err,response:null}); 
        LogModel.findOne({_id:result.logId} ,(err, log)=>{
            if(err) return res.send(500,{success: false, message:'finding log failed, try in a few minte DB OUT',err,response:null});                
            UserModel.findOne({_id: log.userId})
            .populate('referrals')
            .exec(function(err , data){
                if(err){
                     return res.send(500,{success: false, message:'Try to reload the page again in a few minte DB OUT',err,response:null});                
                }else if(data === null){
                    return res.send(401,{success: false, message:'incorrect user name or password',err:null,response:null});                
                }else{
                    // check to see if password is valid 
                    return res.send(200,{success: true, message:'login Successfull',err,response:data,logId:result.logId});                
                }
            })
        })

    })

}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PASSWORD RESET EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.passwordRestFromDashboard = (req , res) =>{
    let {body} = req
    
    if(body.id && body.oldPassword && !body.password){
        UserModel.findOne({_id:body.id},(err,user)=>{
            if(err) return res.send(500, {success: false, message: 'Database down try again in a few minite'})
            
            if(!user._id) return res.send(404, {success:false , message: 'user not found'})
            return user.decrypt(body.oldPassword,res)
        })
    }else if(body.success && body.password){
        UserModel.findOne({_id:body.id},(err,user)=>{
            if(err) return res.send(500, {success: false, message: 'Database down try again in a few minite'});
            if(user === {} || user === null) return res.send(404, {success:false , message: 'incorrect password'});
            let  newpassword = SECRET.PASSWORD_SALT_LEFT + body.password + SECRET.PASSWORD_SALT_RIGTH
            bcrypt.genSalt(10 , (err , salt) => {
                if (err) return null  ;
                bcrypt.hash(newpassword , salt , (err , hash)=>{
                    if (err) return null ; 
                    // update user password section in the database
                    UserModel.findOneAndUpdate({_id:body.id}, {password:hash},(err , update)=>{
                        if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
                        UserModel.findOne({_id:body.id},(err, data)=>{
                            if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
                            return res.send(200,{success: true, message:'password reset successful',updated:true});                            
                        })
                    })
                })
            })
            
        });
    }   
}

// <<<<<<<<<<<<<<<<<<<< FORGOTTEN PASSWORD >>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.passwordRest = (req , res) => {
    let {body , query} = req;
    
// KEYs require in the body 
// email , password
// KEYs require in the query 
// token
    if(!query.token && body.email){
        // send the user an email with token 
        let token = random.generateBase30(8)


        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            secure: true,
            requireTLS: true,
            auth: {
                   user: MAILL.EMAIL_ADDRESS,
                   pass: MAILL.EMAIL_PASSWORD
               },
            tls:{
                rejectUnauthorized: false
            }
           })



        // <<<<<<<<<<<< Checking to see if user exist >>>>>>>>>>>>>>>>>>>>
        UserModel.findOne({email:body.email},(err , user)=>{
            if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
            if(!user._id) return res.send(404,{success: false, message:'invalid email or email does not exist in our database',err,response:null});                
            
            var mailOptions = {     
                from: MAILL.EMAIL_ADDRESS,
                to: `${body.email}`,
                subject: 'Password reset',
                text: `Hello ${user.firstName} , use this token provided to reset your password. TOKEN = ${token}. this token expires in the next 1hr`,
            };                   
            
            transporter.sendMail(mailOptions, function(error, info){     
                if(error) return res.send(200,{success: false, message:'Email sent unsuccessfull try again in a few minite',err:error,response:null});                     
                console.log('Message sent: ' + info.response); 
            //    TODO:: must add an expire time to the jwt
                jwt.sign({token},SECRET.JWT_SECRET_KEY,(err,token)=>{
                    if(err) return console.log(err);
                    // update the user token section with an encrypted token 
                    
                    UserModel.findOneAndUpdate({email:body.email},{token},(err , data)=>{
                        
                        if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
                        return res.send(200,{success: true, message:'Token sent Successfully to your email',err:null,response:null});                
                    })    
                }) 
            });
        })


    }else if(query.token && body.email){
        UserModel.findOne({email:body.email} , (err , user)=>{
            if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
            if(!user._id) return res.send(404,{success: false, message:'invalid email or email does not exist in our database',err,response:null});                
            // verify token 
            jwt.verify(user.token,SECRET.JWT_SECRET_KEY,(err, result)=>{
                if(err) return console.log(err);
                if(result.token.indexOf(query.token) !== -1){
                   
                    
                    let  newpassword = SECRET.PASSWORD_SALT_LEFT + body.password + SECRET.PASSWORD_SALT_RIGTH
                    bcrypt.genSalt(10 , (err , salt) => {
                        if (err) return null  ;
                        bcrypt.hash(newpassword , salt , (err , hash)=>{
                            if (err) return null ; 
                            // update user password section in the database
                            UserModel.findOneAndUpdate({email:body.email}, {password:hash},(err , update)=>{
                                if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
                                UserModel.findOne({email:body.email},(err, data)=>{
                                    if(err) return res.send(500,{success: false, message:'Try to make request again in a few minte DB OUT',err,response:null});      
                                    let log = new LogModel({userId: data._id})
                                    let logId = log._id
                                    log.save((err,logInfo)=>{
                                        if(err) return res.send(500,{success: false, message:'login Successfull but log not saved DB OUT',err,response:data,logId});                
                                        
                                        jwt.sign({logId},SECRET.JWT_SECRET_KEY,(err,token)=>{
                                            (err)=>{
                                                // <<<<< TODO: ERROR HANDLER
                                                console.log(err);
                                            }
                                        return res.send(200,{cookie:token, success: true, message:'Login Successfull',err,response:data,logId});                            
                                        })  
                                                    
                                    })
                                })
                            })
                        })
                    })
                  
                }
            }) 
        })
    }else{
        // send an error message
        return res.send(404,{success: false, message:'Bad request made to the server',err:null,response:null,});                

    }
}




// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LOAD ACCOUNT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.loadAccount = (req, res)=>{
    let {body , query} = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY, (err, hased) => {
        if (err) return res.send(500, { success: false, message: 'Decryption Failed', err, response: null });
        LogModel.findOne({ _id: hased.logId }, (err, log) => {
            if (err) return res.send(500, { success: false, message: 'finding log failed, try in a few minte DB OUT', err, response: null });

            AccountModel.findOne({ userId: log.userId }, (err, account) => {
                if (err) return res.send(500, { success: false, message: 'updating failed, try in a few minte DB OUT', err, response: null });
                if (!account._id) return res.send(404, { success: false, message: 'Not found', err, response: {} });
                
                return res.send(200, { success: true, message: 'Account loaded Successfull', err, response: account, logId: hased.logId });
            })
        })
    })
}




// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LOAD NEXT OF KIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.loadNextOfKin = (req, res) => {
    let { query } = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY, (err, hased) => {
        if (err) return res.send(500, { success: false, message: 'Decryption Failed', err, response: null });
        LogModel.findOne({ _id: hased.logId }, (err, log) => {
            if (err) return res.send(500, { success: false, message: 'finding log failed, try in a few minte DB OUT', err, response: null });

            NextOfkingsModel.findOne({ ownerId: log.userId }, (err, nextOfKin) => {
                if (err) return res.send(500, { success: false, message: 'updating failed, try in a few minte DB OUT', err, response: null });
                if (!nextOfKin._id) return res.send(404, { success: false, message: 'Not found', err, response: {} });

                return res.send(200, { success: true, message: 'Account loaded Successfull', err, response: nextOfKin, logId: hased.logId });
            })
        })
    })
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< VALIDATE USER UNIQUE KEY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


module.exports.checkUniqueKey = (req , res)=>{
    let {body,query} = req;
    jwt.verify(query.token, SECRET.JWT_SECRET_KEY, (err, hased) => {
        if (err) return res.send(500, { success: false, message: 'Decryption Failed', err, response: null });
        LogModel.findOne({ _id: hased.logId }, (err, log) => {
            if (err) return res.send(500, { success: false, message: 'finding log failed, try in a few minte DB OUT', err, response: null });

            UserModel.findOne({ _id: log.userId }, (err, user) => {
                if (err) return res.send(500, { success: false, message: 'updating failed, try in a few minte DB OUT', err, response: null });
                if (!user._id) return res.send(404, { success: false, message: 'Not found', err, response: {} });
                return user.decryptKey(body.key , res)     
            })
        })
    })
}