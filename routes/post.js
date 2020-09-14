const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const user = require('../models/user');

const post = require('../models/post');

const follow = require('../models/follow');

const profileInfo = require('../models/profile')

router.post('/createposts', (req,res)=>{
    console.log(req.body);
    const{title, image, caption, postedBy} = req.body;

    const newPost = new post({
        title,
        image,
        caption,
        date:Date.now(),
        postedBy
    });

    newPost.save().then(myPost=>{
        //console.log('posted successfully');
        //console.log(myPost);
        res.status(200).send(myPost);
    }).catch(err=>{
        console.log('not saved post');
        console.log(err);
    })
})

router.post('/yourposts', (req,res)=>{
    user.findOne({_id:req.body._id}).then(myUser=>{
        const userInfo1 = [];
        userInfo1.push(myUser);
        profileInfo.findOne({userInfo:myUser._id}).then(profBio=>{
            userInfo1.push(profBio);
            post.find({postedBy:myUser._id}).then(myPosts=>{
                userInfo1.push(myPosts);
                res.status(200).send(userInfo1);
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
})



module.exports = router;