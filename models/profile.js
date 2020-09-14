const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profilePic:{
        type:String,
        require:true
    },
    addBio:{
        type:String,
        require:true
    },
    userInfo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const profileInfo = mongoose.model('profileInfo', profileSchema);

module.exports = profileInfo;