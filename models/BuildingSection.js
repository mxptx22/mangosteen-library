const mongoose = require('mongoose');

const BuildingSectionSchema = mongoose.Schema({

name : {
    type: String,
    required: true
},

    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('BuildingSection', BuildingSectionSchema)
