const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('users')
const Orgs = mongoose.model('users') // loads the orgs model
const keys = require('../config/keys');



const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        console.log(jwt_payload);
        const account = jwt_payload.accountType;

        if(jwt_payload.accountType === account ){
            User.findById(jwt_payload.id)
            .then((user)=>{
                //checks whether the id in the payload mathces the id of the user who tries to log in 
                if(user){
                    //if user is found returns the done function from passport along with the user data
                    return done(null, user);
                }else{
                    //if not found still returns the done function but returns a false as a value
                    return done(null,false);
                }
            })
            .catch(err => console.log(err));

        }else if(jwt_payload.accountType === account ) {
            Orgs.findById(jwt_payload.id)
                .then((orgs) => {
                    if(orgs){
                        return done(null, orgs);
                    }else {
                        return done(null,false)
                    }
                }).catch(err => console.log(err));
        } 
   
     
    }));
}


