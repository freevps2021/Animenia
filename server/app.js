const express = require('express');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// set port
const port = process.env.PORT || 3000;

require('dotenv').config();
// set connection to database
mongoose.connect('mongodb://localhost:27017/blogMan', {useNewUrlParser: true});
// launch the app
const app = express();

// allow cors
app.use(cors());
app.options('*', cors());
// set up body-parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// load models
const blog = require('./models/blog');
const post = require('./models/post');
const user = require('./models/user');
const comment = require('./models/comment');
const image = require('./models/image');
const space = require('./models/space');



//load routes
const users = require('./routes/users');
const auth = require('./routes/auth');
const friendship = require('./routes/friendship');
const postsRoute = require('./routes/posts');
const profileRoute = require('./routes/profile');
const anime = require('./routes/anime');
const review = require('./routes/review');

app.use('/users', users);
app.use('/auth', auth);
app.use('/anime', anime);
app.use('/reviews', review);
app.use('/friendship', friendship);
app.use('/posts', postsRoute);
app.use('/profile', profileRoute);



// define the  client route
app.use(express.static(__dirname + '/public'));





function checkToken(req, res, next){
    const tokenHeader = req.headers.authorization;
    if(typeof tokenHeader !=='undefined'){
        const tokenBearer = tokenHeader.split(' ');
        const token = tokenBearer[1];
        req.token = token;
    }else{
        res.status(403).json({err:'unauthorized'})
    }
    next();

}

app.listen(port, err =>{
    if(err) console.log(err);
    console.log(`listening on port ${port}`);

});