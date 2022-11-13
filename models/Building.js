const mongoose = require('mongoose');

const BuildingSchema = mongoose.Schema({
name : {
    type: String,
    required: true
},

active : {
    type: Boolean,
    default: true
}

})

module.exports = mongoose.model('Building', BuildingSchema)
