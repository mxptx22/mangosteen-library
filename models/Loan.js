const mongoose = require('mongoose');


const LoanSchema = mongoose.Schema({
  dateIssued: {
    type: Date,
    required: true,
  },

  dateToReturn: {
    type: Date,
    required: true,
    min: 1,
  },

  isLoaned: {
    type: Boolean,
    required: true,
  },

  dateReturned: {
    type: Date,
  },

  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  
  
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  collectionCopy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollectionCopy",
    required: true,
  }],

  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Loan", LoanSchema);
