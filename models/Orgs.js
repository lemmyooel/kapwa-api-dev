const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    orgName:{
        type: String,
        required: true
    },

    orgEmail: {
        type: String,
        required: true
    },

    orgProfile: {
        
        address: {
            type: String
        },
        about: {
            type:String
        },

    },
    orgPassword: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        default: 'Organization'
    },
    //Activites models
    orgActivities: [{
        orgActivityTitle:{
            type: String,
            required: true
        },
        orgActivityDescription:{
            type: String,
            required: true
        },
        orgActivityDuration:{
            startDate:{
                type: Date,
                required:true
            },
            endDate:{
                type:Date,
                required: true
            }
        },
        orgActivityType:{
            type: String,
            required:true
        }

    }]
});

module.exports = Orgs = mongoose.model('orgs', organizationSchema);