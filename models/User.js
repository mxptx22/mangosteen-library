const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
username : {
    type: String,
    required: true,
    min: 1
    },
    
password : {
    type: String,
    required: true,
    min: 1
    },

type : {
    type: String,
    required: true,
    enum: ['green', 'yellow', 'red'],
},

active : {
    type: Boolean,
    default: true
}

})

module.exports = mongoose.model('User', UserSchema)
