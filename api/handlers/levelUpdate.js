const LevelModel = require('./../../schma/main/levelCalculator');


module.exports.initiateLevelCount = (req , res)=>{
   const levelInitiate =  new LevelModel({});
   levelInitiate.save((err , data)=>{
    res.send({message:'Level initiated successful', data})
   })
}