const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  bookIDNumber: {
    type: Number,
    required: true,
    min: 1,
  },

  title: {
    type: String,
    required: true,
    min: 1,
  },

  author: {
    type: String,
    required: true,
    min: 1,
  },

  publicationType: {
    type: String,
    required: true,
    enum: [
      "Book",
      "Article",
      "Newspaper",
      "TextualResource",
      "MediaResource",
      "Other",
    ],
  },

  publisher: {
    type: String,
    required: true,
    min: 1,
  },

  edition: {
    type: String,
    required: false,
    min: 1,
  },

  ISBN: {
    type: String,
    required: false,
    min: 1,
  },

  yearPublished: {
    type: Number,
    required: true,
    min: 999,
    max: 9999,
  },

  language: {
    type: String,
    required: true,
    min: 1,
  },

  cover: {
    type: String,
    required: false,
    min: 1,
  },

  description: {
    type: String,
    required: false,
    min: 1,
  },

  location: {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    buildingSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuildingSection",
      required: true,
    },
  },

  collectionCopies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollectionCopy",
    required: true,
  }],

  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Book", BookSchema);
