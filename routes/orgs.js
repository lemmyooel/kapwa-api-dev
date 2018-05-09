const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User Model
const User = require('../models/User');
//Load Organization Model
const Orgs = require('../models/Orgs');
//Load keys
const keys = require('../config/keys');


/****************** Test Route  *******************/
//@server setup
router.get('/test', (req,res) => {
    res.json({msg: 'User Test Route'});
});

/****************** Test Route ******************/

/****************** Register Organization Route  *******************/
// POST request for api/orgsorgs/register
// Register Route
// Public Access

router.post('/register', (req,res) => {
    //check first if user is already registered
    Orgs.findOne( { orgEmail: req.body.email } )
        .then((org) => {
            if(org){
                return res.status(404).json({msg: 'Email is already used'});
            }else{
                //create an instance of the organizatio class
                const newOrg = new Orgs({
                    orgName: req.body.name,
                    orgEmail: req.body.email,
                    orgPassword: req.body.password
                });

                
                //Encrptys Passowrd
                // https://www.npmjs.com/package/bcryptjs
                bcrypt.genSalt(10, (err,salt) => {
                    //encrpts the password
                    bcrypt.hash(newOrg.orgPassword,salt,(err,hash) => {
                        if(err) throw err;
                        //password gets the hashed password
                        newOrg.orgPassword = hash;
                        //Saves the User in the database
                        newOrg.save()
                        .then((org)=>{
                            res.json(org);
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        }).catch(err => res.json({msg: 'Error critical', err: err}));
});

/****************** Organization Route ******************/

/****************** Register Organization Route  *******************/
// POST request for api/orgsorgs/register
// Register Route
// Public Access

router.post('/login', (req,res) => {
    const password = req.body.password;
    
    Orgs.findOne({ orgEmail: req.body.email })
        .then((orgs) => {
            //check if the orgs exists in the database
            console.log(orgs);
            if(!orgs){
                return res.status(401).json({msg: 'The Organization does not exist'});
            }else{

                //need to compare the password if they are identical
                bcrypt.compare(password, orgs.orgPassword)
                .then((isMatch)=>{
                    //the promise returns a boolean whether password has matched or not
                    //check if passwords match
                    if(isMatch){
                       //User Matched
                        //Creates the JST payload
                       const payload = {
                           id: orgs.id,
                           email: orgs.orgEmail,
                           name: orgs.orgName,
                           accountType: orgs.accountType
                       }
 
                       //Assign token to the org
                       jwt.sign(
                           payload, 
                           keys.secret,
                           {expiresIn: 3600 },
                           (err, token) => {
                               res.json({
                                   success: true,
                                   token: 'Bearer ' + token
                               })//chuhu
                           }
                        
                        );
                    }else {
                        //if it passwords doesnt match
                        errors.password = 'Password is Incorrect'
                        return res.status(400).json(errors);
                    }
                })
            }
        }).catch(err => res.json({msg: 'Critical Error', err:err}));
});

/****************** Organization Route ******************/


/*************** Current ROUTE *******************/
// GET request for api/users/current
// this returns the current user // also can be used for testing to check who is currently logged in 
// Private Access
router.get('/current', passport.authenticate('jwt',{session: false}), (req,res) =>{
    res.json({
        id: req.orgs.id,
        orgName: req.orgs.name,
        orgEmail: req.orgs.email,
        
    });
})

/*************** End of Test ROUTE *******************/



module.exports = router;