const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: 'User'
    }
   

});


module.exports = User = mongoose.model('users', userSchema);