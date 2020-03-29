const passportLocal = require('passport-local')
const localStrategy = passportLocal.Strategy
const Usermodel = require('./../schma/main/user')


module.exports = function(passport){
    passport.use(
        new localStrategy((userName , password , done)=>{
            Usermodel.findOne(userName).then((user)=>{
                if(!user) return done(null,false,{message:'This user name is not registed'});
                if(user.decrypt(password)){
                    return done(null,user,{message:'Login successful'})
                }else{
                    return done(null,false,{message:"incorrect user name or password"})
                }
            }).catch(err => console.log(err))
        })
    )
    passport.serializeUser((user, done)=> {  
        done(null, user.id); 
    });
 
    passport.deserializeUser((id, done)=> {  
        User.findById(id, (err, user)=> {    done(err, user);  }); 
    });
}