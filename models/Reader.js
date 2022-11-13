const mongoose = require("mongoose");

const ReaderSchema = mongoose.Schema({
  readerIDNumber: {
    type: Number,
    required: true,
    min: 1,
  },

  firstName: {
    type: String,
    required: true,
    min: 1,
  },

  surName: {
    type: String,
    required: true,
    min: 1,
  },

  phoneNumber: {
    type: String,
    required: true,
    min: 1,
  },

  emailAddress: {
    type: String,
    required: true,
    min: 1,
  },

  address1: {
    type: String,
    required: true,
    min: 1,
  },

  address2: {
    type: String,
    required: false,
    min: 1,
  },

  addressPostcode: {
    type: String,
    required: true,
    min: 1,
  },

  addressCity: {
    type: String,
    required: true,
    min: 1,
  },

  localResidence: {
    type: String,
    required: true,
    enum: ["true", "false"],
  },

  educationStatus: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6"],
  },

  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Reader", ReaderSchema);
