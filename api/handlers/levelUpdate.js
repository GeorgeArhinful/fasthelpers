const UserModel = require('./../../schma/main/user');
const LevelModel = require('./../../schma/main/levelCalculator');
const UnpayedModel = require('./../../schma/main/unpayed');


module.exports.initiateLevelCount = (req , res)=>{
   const levelInitiate =  new LevelModel({});
   levelInitiate.save((err , data)=>{
    res.send({message:'Level initiated successful', data})
   })
}





 module.exports.updateLevel  = (req, res) => {
    var users,obj;
    var newSignup = []; 
    var unPayedUsers = [];

    UserModel.find({},(err , data)=>{
        users = data
        LevelModel.findOne({},(err , level)=>{
            obj = level;




//  CALCULATE THE AMOUT TO BE PAID TO A MEMBER

const calculatingAmount = (portal, level)=>{
    let amount = 0
    switch (portal) {
        case 1:
           amount = level !==0 && level%3 === 0 ? 900:100;
            return amount;
        case 2:
            amount = level % 3 === 0 ? 6500 : 500;
            return amount;
        case 3:
        amount = level % 3 === 0 ? 13000 : 1000;
            return amount;
        case 4:
        amount = level % 3 === 0 ? 26000 : 2000;
            return amount;
        case 5:
        amount = level % 3 === 0 ? 65000 : 5000;
            return amount;
        case 6:
        amount = level % 3 === 0 ? 185000 : 15000;
            return amount;
        case 7:
            amount = level % 3 === 0 ? 650000: 50000;
            return amount;
        case 8:
            amount = level % 3 === 0 ? 2300000 : 150000;
            return amount;
        default:
            return amount;
    }
}



const updateusersLevelIndateBase = (message)=>{
    for (let i = obj.prevPeople; i >= 0; i--){
        let user = users[i];
        UserModel.findByIdAndUpdate({_id:user._id},user,(err , update)=>{
            if(err) console.error(err);
            
        })
    }
LevelModel.findByIdAndUpdate({_id:obj._id},obj,(err, data)=>{
    // must run if there are an unPayedUsers
    if(unPayedUsers.length){
        for (let g = 0; g < unPayedUsers.length; g++) {
            
            let unPayedUser = unPayedUsers[g];
            console.log(unPayedUser.amount );
            let newUnpayedUser = new UnpayedModel(unPayedUser);
            newUnpayedUser.save((err, data)=>{
                if(err) console.error(err);
            })
        }
        unPayedUsers = []
    }
    // must run if there are newSignup
    if (newSignup.length) {
        newSignup.forEach(user => {
            user._doc.ownerId = user._doc.ownerId ? user._doc.ownerId : user._id
            user._doc.userName = user._doc.userName + '.1';
            user._doc.email = user._doc.email + '.1'
            user._doc.level = 0; // setting new user level to 0
            user._doc.portal = 1; // setting new user level to 0
            delete user._doc._id
            delete user._id


            let newUser = new UserModel({...user._doc});
            newUser.save((err, data) => {
                if (err) console.error(err);
            })
        });
        newSignup = [];
    }
                    
    return console.log({
        message,
        totalUser: users.length,
        obj
    })
                }); 
            }









            const updateUserLevel = ()=>{
                // Base line of our reccusion fucntion
                if(users.length ===0) return console.log({message:'done', totalUser:users.length,obj});




                // Must run when current people is greater than the number of signup users
                if (obj.currentPeople > (users.length - 1)){
                    let topUpPeople = users.length - obj.prevPeople - 1;
                    let divider = Math.floor(topUpPeople / 3) ;
                    console.log(divider, `done : gdivider has a zero value  ${divider}`);
    
                    if (!divider){
                        return updateusersLevelIndateBase(`done : divider has a zero value  ${divider}`) 
                    }
                   if (obj.levelOverflow < divider) {
                       for (let g = (Math.floor(obj.prevPeople / 3) + obj.levelOverflow); g < (Math.floor(obj.prevPeople / 3) + divider); g++) {
                           let user = users[g];
                           user.level += 1;
                            // must run if level is odd num
                            // people to be payed
                            if((user.level % 2)){
                                let calculatedLevel = (user.level - ((user.portal - 1) * 3));
                                let amount = calculatingAmount(user.portal, calculatedLevel);
                                console.log(amount);
                                unPayedUsers.push({
                                    userId: user._id,
                                    portal: user.portal,
                                    level: calculatedLevel, // calculating the level of a user 
                                    amount: amount
                                })
                            }
                       };
                        obj.levelOverflow = divider;
                        return updateusersLevelIndateBase(`done : current people needed is not met but few were able to update thier level  ${divider}`) 
                   }
                    return updateusersLevelIndateBase('done : current people needs is not met')
                }






                // Must run when current people is less  than the number of signup users and levelOverflow is zero (0)
                if((obj.currentPeople <= (users.length-1)) && obj.levelOverflow === 0 ){
                      for (let i = obj.prevPeople; i >= 0; i--) {
                          let user = users[i];
                          if(!user.level) user.level = 0;
                          user.level += 1;
                        // must run if level is odd num
                        // people to be payed
                            if((user.level % 2)){
                                let calculatedLevel = (user.level - ((user.portal - 1) * 3));
                                let amount = calculatingAmount(user.portal, calculatedLevel);
                                console.log(amount);
                                unPayedUsers.push({
                                    userId: user._id,
                                    portal: user.portal,
                                    level: calculatedLevel, // calculating the level of a user
                                    amount: amount 
                                })
                            }
                        //   Must run if level is greater than 2
                            if(user.level>2){
                                let levelDivider = Math.floor(user.level / 3) //Check to see the current portal of the user
                                if (levelDivider === user.portal) {
                                    if(levelDivider === 1){
                                        let newUser = {...user}; // creating new user
                                        newSignup.push(newUser); // adding user to people to be recycled
                                    }
                                    user.portal = levelDivider + 1 //updating user portal to the next
                                }
                            }
                          console.log(user._id, "3 Update to level", user.level);
                          
                      };
                      console.log("YES COMPLETED last");
                      
                      obj.prevPeople = obj.currentPeople;
                      obj.prevLevel = obj.level;
                      obj.level = obj.prevLevel * 3;
                      obj.currentPeople = obj.prevPeople + obj.level;
                     return updateUserLevel();
                }





                

                // Must run when current people is less  than the number of signup users and levelOverflow is not zero (0)
                if ((obj.currentPeople <= (users.length-1)) && obj.levelOverflow > 0) {
                        console.log('loc', Math.floor(obj.prevPeople / 3));
                    for (let h = (Math.floor(obj.prevPeople / 3) - 1); h >= 0; h--) {
                        let user = users[h];
                        if (!user.level) user.level = 0;
                         user.level = user.level + 1;
                        console.log('user', user._id, user.level);
                        // must run if level is odd num
                        // people to be payed
                        if ((user.level % 2)) {
                            let calculatedLevel = (user.level - ((user.portal - 1) * 3));
                            let amount = calculatingAmount(user.portal, calculatedLevel);
                            console.log(amount);
                            
                            unPayedUsers.push({
                                userId: user._id,
                                portal: user.portal,
                                level: calculatedLevel, // calculating the level of a user 
                                amount: amount,
                            })
                        }
                        //   Must run if level is greater than 2
                        if (user.level > 2) {
                            let levelDivider = Math.floor(user.level / 3) //Check to see the current portal of the user
                            if (levelDivider === user.portal) {
                                if (levelDivider === 1) {
                                    let newUser = {...user}; // creating new user
                                    newSignup.push(newUser); // adding user to people to be recycled
                                }
                                user.portal = levelDivider + 1 //updating user portal to the next
                            }
                        }

                    }
                    console.log('first loop finish');
                    for (let i = (Math.floor(obj.prevPeople / 3) + obj.levelOverflow); i <= obj.prevPeople; i++){
                        let user = users[i];
                        if (!user.level) user.level = 0;
                        user.level = user.level + 1;
                        // must run if level is odd num
                        // people to be payed
                        if((user.level % 2)){
                            let calculatedLevel = (user.level - ((user.portal - 1) * 3));
                            let amount = calculatingAmount(user.portal, calculatedLevel);
                            console.log(amount);
                            unPayedUsers.push({
                                userId: user._id,
                                portal: user.portal,
                                level: calculatedLevel, // calculating the level of a user 
                                amount: amount
                            })
                        }
                        console.log(user._id, "4 Update to level", user.level);
                    };
                    

              
                    console.log("YES COMPLETED SECTION For the last");
                    obj.levelOverflow = 0
                    obj.prevPeople = obj.currentPeople;
                    obj.prevLevel = obj.level;
                    obj.level = obj.prevLevel * 3;
                    obj.currentPeople = obj.prevPeople + obj.level;
                    return updateUserLevel();
                }
                

            }
            return updateUserLevel()
        })
    })
    
}      