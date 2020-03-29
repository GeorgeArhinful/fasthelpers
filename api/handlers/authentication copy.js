const nodeMailer = require('nodemailer')
const UserModel = require('./../../schma/main/user');
const LogModel = require('./../../schma/main/log');
const jwt = require('jsonwebtoken');
const SECRET = require('./../../config/auth');
const MAILL = require('./../../config/mail');
const bcrypt = require('bcrypt');


const NextOfkingsModel = require('./../../schma/main/nextOfKings');

let updateUserInfo = (obj , update)=>{
    let result = {
        success: false,
        msg: null
    }

    return result
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SIGNUP EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.register = function(req,res){
    let credencial = req.body;
    let refferral = req.query;
    console.log(req.body);
    
    // TODO :
    // 1. validate input 
    // 1. check to see if no user with the same user name is in the database
    
    // <<<<<<<<<<<<<<<<< IF ON REFFERRAL, DO THIS >>> FUTURE UPDATE >>>>>>>>>>>>>>>>>
    // if(refferral.userName === undefined) return res.send(500,{success: false, message: 'Use a refferral link to signup',err:null, response : null});

    if(refferral && refferral.userName){
        UserModel.findOne(refferral,(err,refferralInfo)=>{
            if(err){
                return res.send(500,{success: false, message: 'Try to signup again in a few minte DB OUT',err, response: null});
            }else if (refferralInfo === null){
                return res.send(200,{success: false, message: 'Invalid refferral link', err: null,response: null });
            }else{    
                // <<<<<<<< Cheching to see if user has already signup >>>>>>>>
                UserModel.findOne({userName: credencial.userName},(err,result)=>{
                    
                    if(err){
                        return res.send(500,{success: false, message: 'Try to signup again in a few minte DB OUT',err, response : null});
                    }else if (result !== null){
                        return res.send(200,{success: false, message: 'the user name is been use by other user', err: null,response : null });
                    }else{
                        // 2. create an instants of the user
                        let newUser = new UserModel({...credencial,referral:refferralInfo._id}) 
                        let userId = newUser._id               
                        // 5. save user to database
                        newUser.save((err,data)=>{
                            // <<<<<<<< FINDING THE REFFERRAL _ID  >>>>>>>>
                            UserModel.findOne({userName: credencial.userName},(err, userDataInfo)=>{
                            // <<<<<<<< UPDATING THE REFFERRAL REFFERRALS WITH IT ID >>>>>>>>
                                UserModel.findOneAndUpdate({_id: refferralInfo._id} , {referrals:[...refferralInfo.referrals,userDataInfo._id]} , (err,referralUpdate)=>{
                                    if(err) return res.send(200,{success: true, message:'refferral Update Unsuccessfull DB OUT',err,response:null});                
                                    // 6. set cookies
                                    // 7. send response to user
                                    let log = new LogModel({userId})
                                    let logId = log._id
                                    log.save((err,logInfo)=>{
                                        if(err) return res.send(200,{success: true, message:'Signup Successfull but log not saved DB OUT',err,response:data,logId});                
                                        
                                        jwt.sign({logId},SECRET.JWT_SECRET_KEY,(err,token)=>{
                                            (err)=>{
                                                // <<<<< TODO: ERROR HANDLER
                                                console.log(err);
                                            }
                                            console.log(token);
                                        return res.send(200,{cookie:token, success: true, message:'Signup Successfull',err,response:{...data,_id:userId},logId});                            
                                        })  
                                                    
                                    })
                                })
                            })
                        })
            
                    }
                }) 
            }
        })
    }
}



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NEXT OF KING SIGNUP EDNPOINT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

module.exports.nextOfkingSignUp  = (req , res) => {
    let {body,query} = req
    let newUser = new NextOfkingsModel({...body})
    newUser.save((err, kings)=>{
        if(err) return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});                
        UserModel.findOneAndUpdate({_id:body.ownerId} , {setNextOfKing: true} , (err, data)=>{
            if(err) return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});
            UserModel.findOne({_id:body.ownerId}, (err,userInfo)=>{
            if(err) return res.send(500,{success: false, message:'Try to signup again in a few minte DB OUT',err,response:null});
                return res.send(200,{success: true, message:'Next Of KingSignUp Successfull',err,response: userInfo});                            
            })
        }) 
    })
}




module.exports.accoutSetUp = (req , res) => {
    let {body , query}  = req
    
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
    if(body.id , body.oldPassword && !body.password){
        UserModel.findOne({_id:body.id},(err,user)=>{
            if(err) return res.send(500, {success: false, message: 'Database down try again in a few minite'})
            if(user === {} || user === null) return res.send(404, {success:false , message: 'incorrect password'})
            return user.decrypt(body.oldPassword,res)
        })
    }else{
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
                            return res.send(200,{success: true, message:'password reset successful'});                            
                        })
                    })
                })
            })
            
        });
    }   
}

module.exports.passwordRest = (req , res) => {
    let {body , query} = req;
    console.log(body);
    
// KEYs require in the body 
// email , password
// KEYs require in the query 
// token
    if(!query.token && body.email){
        // send the user an email with token 
        let token = 'george442.@23'
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
                from: 'contact.fasthelpers@gmail.com',
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