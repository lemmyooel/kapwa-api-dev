const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

//LOAD user.js
const users = require('./routes/user');
const orgs = require('./routes/orgs');
//Load keys.js
const keys = require('./config/keys');



const app = express();


/*************** Passport Middleware *******************/
app.use(passport.initialize());
//Load passport config
require('./config/passport')(passport);
//require('./config/orgpassport')(passport);
/***************  Passport Middleware *******************/


/*************** Body Parser Middleware *******************/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
/*************** End of Body Parser Middleware *************/

/*************** Database Connection *******************/
// connecting to localhost DB
mongoose.connect(keys.mongodb)
        .then(() => console.log('Connected to Local DB'))
        .catch(err => console.log(err));
/*************** End of Database Connection  *************/

/****************** Middleware Route  *******************/
//@server setup
app.use('/api/users', users);
app.use('/api/orgs/', orgs);

/****************** Middleware Route ******************/


/****************** Server Setup *******************/
//@server setup
const port = 3000 || process.env.PORT;
app.listen(port,() => {
    console.log(`Connected to Port ${port}`);
});

/*************** End of Server Setup ****************/