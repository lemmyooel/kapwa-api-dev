const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User Model
const User = require('../models/User');
//Load keys
const keys = require('../config/keys');


/****************** Test Route  *******************/
//@server setup
router.get('/', (req,res) => {
    res.json({msg: 'User Test Route'});
});

/****************** Test Route ******************/


/****************** Register Route  *******************/
// POST request for api/users/register
// Register Route
// Public Access

router.post('/register', (req,res) =>{
   
    User.findOne({ email: req.body.email })
        .then((user) => {
            //checks if User email exists
            if(user){
                //if User exists returns an object with 400 as status
                return res.status(400).json({ email: 'Email already used' });
            }else{
             

                //Creates a new User if user email doesn not exist
                const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password
                });

                //Encrptys Passowrd
                // https://www.npmjs.com/package/bcryptjs
                bcrypt.genSalt(10, (err,salt) => {
                    //encrpts the password
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;
                        //password gets the hashed password
                        newUser.password = hash;
                        //Saves the User in the database
                        newUser.save()
                        .then((user)=>{
                            res.json(user);
                        })
                        .catch(err => console.log(err));
                    });
                });

            }
        })
        .catch(err => console.log(err));
})


/****************** Register Route ******************/

/****************** Log In Route  *******************/
// POST request for api/users/register
// Log In Route
// Public Access

router.post('/login', (req,res) => {


 const email = req.body.email;
 const password = req.body.password;

 //finds user in the DB whether user exists or not via email
 User.findOne({email})
   .then((user) =>{
       //CHeck if User exists
       if(!user){
          
           return  res.status(404).json({msg: "User is not found"});
       }else{
           //if user has been located need to compare the password with the stored hashed password in mongo DB
           bcrypt.compare(password, user.password)
               .then((isMatch)=>{
                   //the promise returns a boolean whether password has matched or not
                   //check if passwords match
                   if(isMatch){
                      //User Matched
                       //Creates the JST payload
                      const payload = {
                          id:user.id,
                          firstname: user.firstname,
                          lastname: user.lastname,
                          accountType: user.accountType
                          
                      }

                      //Assign token to the user
                      jwt.sign(
                          payload, 
                          keys.secret,
                          {expiresIn: 3600 },
                          (err, token) => {
                              res.json({
                                  success: true,
                                  token: 'Bearer ' + token
                              })
                          }
                       
                       );
                   }else {
                       //if it passwords doesnt match
                       errors.password = 'Password is Incorrect'
                       return res.status(400).json(errors);
                   }
               })
       }

   })
});

/****************** Log In Route ******************/



/*************** Current ROUTE *******************/
// GET request for api/users/current
// this returns the current user // also can be used for testing to check who is currently logged in 
// Private Access
router.get('/current', passport.authenticate('jwt',{session: false}), (req,res) =>{
    res.json({
        id: req.user.id,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        accountType: req.user.accountType
    });
})

/*************** End of Test ROUTE *******************/



module.exports = router;