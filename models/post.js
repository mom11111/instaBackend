const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    caption:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        require:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const post = mongoose.model('post',postSchema);

module.exports = post;