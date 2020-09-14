const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const user = require('../models/user');

const post = require('../models/post');

const follow = require('../models/follow');

const profileInfo = require('../models/profile');

router.get('/',(req,res)=>{
    res.status(200).json({message:"app is working"});
})

router.post('/register', (req,res)=>{

      const{name, email, password} = req.body;

      if(!name || !email || !password)
          return res.status(400).json({message:"fill all fields"});

     else{

        user.findOne({email:email}).then(savedUser=>{
            if(savedUser)
                return res.status(400).json({message:"already used email"});
            else{
                const newUser = new user({
                    name,
                    email,
                    password
                });
          
                newUser.save().then(myUser=>{
                    console.log('user saved');
                    const newProfile = new profileInfo({
                         profilePic:"https://res.cloudinary.com/nishantsunny/image/upload/v1587282967/samples/landscapes/beach-boat.jpg",
                         addBio:"hi i am new User",
                         userInfo:myUser._id
                    });
                    newProfile.save().then(abc=>{
                        console.log(myUser);
                        res.send(myUser);
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }
        }).catch(err=>{
            console.log(err);
        })

    }
})

router.post('/login', (req,res)=>{
    const {email, password} = req.body;
    user.findOne({email:email}).then(myUser=>{
        if(myUser.password==password)
         {
             console.log('user is authentic');
             const userInfo = [];
             userInfo.push(myUser);
             follow.find({followedBy:myUser._id}).then(iFollow=>{
                 userInfo.push(iFollow.length);
                 follow.find({followingBy:myUser._id}).then(theyFollow=>{
                     userInfo.push(theyFollow.length);
                     const alreadyFollowed = [];
                     alreadyFollowed.push(myUser._id);
                     //console.log(iFollow);
                     for(let i=0;i<iFollow.length;i++){
                         alreadyFollowed.push(iFollow[i].followingBy);
                     }
                     //console.log(alreadyFollowed);

                     post.find({postedBy:{$in:alreadyFollowed}}).sort('date').then(timelinePosts=>{
                         userInfo.push(timelinePosts);
                         //console.log(timelinePosts);
                         profileInfo.findOne({userInfo:myUser._id}).then(profilePic=>{
                              userInfo.push(profilePic);
                              post.countDocuments({postedBy:myUser._id}).then(countPost=>{
                                  userInfo.push(countPost);
                                res.status(200).send(userInfo);
                              })
                         }).catch(err=>{
                             console.log(err);
                         })
                     }).catch(err=>{
                         console.log(err);
                     })
                 }).catch(err=>{
                     console.log(err);
                 })
             }).catch(err=>{
                 console.log(err);
             })
         }
         else{
             return res.status(400).json({message:"wrong password"});
         }
    }).catch(err=>{
        return res.status(400).json({message:'wrong email'});
    })
})


module.exports = router;