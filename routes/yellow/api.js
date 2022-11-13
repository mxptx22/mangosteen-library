var express = require("express");
var router = express.Router();
const Reader = require("../../models/Reader");
const Book = require("../../models/Book");
const CollectionCopy = require("../../models/CollectionCopy");
const Loan = require("../../models/Loan");

// List All Readers
router.post("/readers", async function (req, res, next) {
  try {
    let readerQuery = req.body.input;
    let readerQueryNumber = null;
    if (Number(readerQuery)) {
      readerQueryNumber = readerQuery;
    }
    let readersThese = await Reader.find({
      $and: [
        { active: true },
        {
          $or: [
            { firstName: new RegExp(readerQuery, "i") },
            { surName: new RegExp(readerQuery, "i") },
            { readerIDNumber: readerQueryNumber },
          ],
        },
      ],
    });
    res.json(readersThese);
  } catch (err) {
    res.json(err);
  }
});

// List All Books
router.post("/books", async function (req, res, next) {
  try {
    let bookQuery = req.body.input;
    let bookQueryNumber = null;
    let collectionCopyQueryIDNumber = null;

    if (Number(bookQuery)) {
      bookQueryNumber = bookQuery;

      if (bookQueryNumber.length == 10) {
        let relevantCopy = await CollectionCopy.findOne({
          copyIDNumber: bookQueryNumber,
        });
        collectionCopyQueryIDNumber = relevantCopy["_id"];
        console.log(collectionCopyQueryIDNumber);
      }
    }

    let booksThose = await Book.find({
      $and: [
        { active: true },
        {
          $or: [
            { title: new RegExp(bookQuery, "i") },
            { author: new RegExp(bookQuery, "i") },
            { bookIDNumber: bookQueryNumber },
            { ISBN: bookQueryNumber },
            { collectionCopies: collectionCopyQueryIDNumber },
          ],
        },
      ],
    }).populate("collectionCopies");

    let copiesThose = booksThose.map((e) => e.collectionCopies).flat();
    let copyIdsThose = copiesThose.map((f) => f._id);

    let loansPrecluding = await Loan.find({
      collectionCopies: copyIdsThose,
      isLoaned: true,
    }).populate("collectionCopy");

    let copyIdsPrecluding = loansPrecluding
      .map((g) => g.collectionCopy)
      .flat()
      .map((h) => h._id.toString());

    let booksThese = booksThose
      .map((w) => {
        return { ...w };
      })
      .map((x) => x._doc)
      .map((y) => {
        return {
          ...y,
          collectionCopies: y.collectionCopies.filter(
            (z) => !copyIdsPrecluding.includes(z._id.toString())
          ),
        };
      });

    res.json(booksThese);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
