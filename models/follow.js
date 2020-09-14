const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    followedBy:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
    },
    followingBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    }
})

const follow = mongoose.model('follow', followSchema);

module.exports = follow;