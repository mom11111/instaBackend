const express = require('express');

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const auth = require('./routes/auth');

const follow = require('./routes/follow');

const post = require('./routes/post');

const profile = require('./routes/profile')

const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://Nishant:<password of cluster>@cluster0.oppns.mongodb.net/<dbname>?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}, (err,res)=>{
    if(err)
      console.log(error);
    else
       console.log('connected to the db');
})

app.use(auth);

app.use(follow);

app.use(post);

app.use(profile);

app.listen(process.env.PORT, '0.0.0.0')
