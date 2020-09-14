const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const profileInfo = require('../models/profile');

const user = require('../models/user');

router.post('/addprofilepic', (req,res)=>{
    console.log(req.body);
    const {profilePic, addBio, userInfo} = req.body;
    profileInfo.findOneAndUpdate({userInfo:userInfo},{$set:{profilePic:profilePic, addBio:addBio}}).then(updatedInfo=>{
        if(updatedInfo){
        //console.log(updatedInfo);
        res.status(200).send(updatedInfo);
        }
        else{
            const addPic = new profileInfo({
                profilePic,
                addBio,
                userInfo
            });
            addPic.save().then(userinfo=>{
                console.log('profilePic updated');
                //console.log(userinfo);
                res.status(200).send(userinfo);
            }).catch(err=>{
                console.log(err);
            })
        }
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;