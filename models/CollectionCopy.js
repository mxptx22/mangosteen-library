const mongoose = require("mongoose");

const CollectionCopySchema = mongoose.Schema({
  copyIDNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("CollectionCopy", CollectionCopySchema);
