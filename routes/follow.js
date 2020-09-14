const express = require('express');

const router = express.Router();

const user = require('../models/user');

const follow = require('../models/follow');

const profileInfo = require('../models/profile');

const mongoose = require('mongoose');

router.post('/getsuggestions', (req,res)=>{
    //console.log(req.body);
    follow.find({followedBy:req.body.id}).then(alreadyFollowed=>{
       // console.log(alreadyFollowed);
        if(alreadyFollowed.length>0){
            const ids = [];
             for(let i=0;i<alreadyFollowed.length;i++){
                   ids.push(alreadyFollowed[i].followingBy);
             }
            const allInfo = [];
             user.find({_id:{$nin:ids}}).then(users=>{
                 const userIds = [];
                 for(let i=0;i<users.length;i++)
                      userIds.push(users[i]._id);
                profileInfo.find({userInfo:{$in:userIds}}).then(profilePic=>{
                     allInfo.push(users);
                     allInfo.push(profilePic);
                     res.status(200).send(allInfo);
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })

        }

        else{
       console.log('else');
        user.find({}).then(users=>{
            const ids = [];
            const allInfo = [];
            for(let i=0;i<users.length;i++)
                 ids.push(users[i]._id);
            profileInfo.find({userInfo:{$in:ids}}).then(profilePic=>{
                 allInfo.push(users);
                 allInfo.push(profilePic);
                 //console.log(profilePic);
                 res.status(200).send(allInfo);
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    })
})

router.post('/followtheuser', (req,res)=>{

    const {followedBy, followingBy} = req.body;

    const newFollow = new follow({
        followedBy,
        followingBy
    });

    newFollow.save().then(entry=>{
        //console.log(entry);
        res.status(200).send(entry);
    }).catch(err=>{
        console.log(err);
    })
})

router.post('/youfollowthem', (req,res)=>{
    follow.find({followedBy:req.body._id}).then(myFollowings=>{
        const myFollowingsId = [];
        for(let i=0;i<myFollowings.length;i++){
            myFollowingsId.push(myFollowings[i].followingBy);
        }
        const allInfo = [];
        user.find({_id:{$in:myFollowingsId}}).then(allFollowingsInfo=>{
            allInfo.push(allFollowingsInfo);
            const ids = [];
           for(let i =0;i<allFollowingsInfo.length;i++)
                  ids.push(allFollowingsInfo[i]._id);
            profileInfo.find({userInfo:{$in:ids}}).then(profilePic=>{
                allInfo.push(profilePic);
                res.status(200).send(allInfo);
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    })
})

router.post('/theyfollowyou', (req,res)=>{
    console.log(req.body);
    follow.find({followingBy:req.body._id}).then(myFollowers=>{
        const myFollowersId = [];
        for(let i=0;i<myFollowers.length;i++){
            myFollowersId.push(myFollowers[i].followedBy);
        }
        const allInfo = [];
        user.find({_id:{$in:myFollowersId}}).then(allFollowersInfo=>{
           // console.log(allFollowersInfo);
           allInfo.push(allFollowersInfo);
           const ids = [];
          for(let i =0;i<allFollowersInfo.length;i++)
                 ids.push(allFollowersInfo[i]._id);
           profileInfo.find({userInfo:{$in:ids}}).then(profilePic=>{
               allInfo.push(profilePic);
               res.status(200).send(allInfo);
           }).catch(err=>{
               console.log(err);
           })
           // res.status(200).send(allFollowersInfo);
        }).catch(err=>{
            console.log(err);
        })
    })
})

router.post('/findwhodoesnotfollowback', (req,res)=>{
    console.log(req.body);
    follow.find({followedBy:req.body._id}).then(allFollowing=>{
        follow.find({followingBy:req.body._id}).then(allFollowers=>{
            const notFollowBack = [];
            const myMap = new Map();
            for(let i=0;i<allFollowers.length;i++){
                //console.log(typeof(allFollowers[i].followedBy));
                const s=JSON.stringify(allFollowers[i].followedBy);
                myMap.set(s,i);
            }
            //console.log(myMap.size);
            for(let j=0;j<allFollowing.length;j++){
               // console.log(typeof(allFollowers[j].followedBy));
                const s=JSON.stringify(allFollowing[j].followingBy);
                if(myMap.has(s)){
                   console.log('found');
                }
                else{
                    notFollowBack.push(allFollowing[j].followingBy);
                }
            }
            //console.log(notFollowBack);
            const allInfo = [];
            user.find({_id:{$in:notFollowBack}}).then(allUsers=>{
                allInfo.push(allUsers);
                const ids = [];
               for(let i =0;i<allUsers.length;i++)
                      ids.push(allUsers[i]._id);
                profileInfo.find({userInfo:{$in:ids}}).then(profilePic=>{
                    allInfo.push(profilePic);
                    res.status(200).send(allInfo);
                }).catch(err=>{
                    console.log(err);
                })
               // res.status(200).send(allUsers);
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