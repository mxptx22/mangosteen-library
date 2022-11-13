var express = require("express");
var router = express.Router();
let CollectionCopy = require("../../models/CollectionCopy");
let Building = require("../../models/Building");
let BuildingSection = require("../../models/BuildingSection");
let Book = require("../../models/Book");
let Loan = require("../../models/Loan");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let booksAll = await Book.find({ active: true });
    res.render("yellow/booksRouter/index", { books: booksAll });
  } catch (err) {
    res.send(err);
  }
});

// View Routes
router.get("/view/:id", async function (req, res, next) {
  try {
    let booksThis = await Book.findOne({ _id: req.params.id }).populate(
      "location.building location.buildingSection collectionCopies"
    );
    let relevantLoans = await Loan.find({
      book: req.params.id,
      isLoaned: true,
    });
    let loanedCopies = relevantLoans
      .map((x) => {
        return x.collectionCopy.toString();
      })
      .flat();

    res.render("yellow/booksRouter/viewBook", {
      book: booksThis,
      collectionCopies: booksThis["collectionCopies"],
      relevantLoans: relevantLoans,
      loanedCopies: loanedCopies,
    });
  } catch (err) {
    res.send(err);
  }
});

// Add Collection Copy Routes
router.post("/view/:id/addcollectioncopy", async function (req, res, next) {
  try {
    const CollectionCopyNew = new CollectionCopy({
      copyIDNumber: req.body.copyIDNumber,
      description: req.body.description,
      active: true,
    });
    await CollectionCopyNew.save();
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          collectionCopies: CollectionCopyNew._id,
        },
      }
    );
    res.redirect(`/yellow/books/view/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/yellow/books/view/${req.params.id}`);
  }
});

router.post("/view/:id/deletecollectioncopy", async function (req, res, next) {
  try {
    let updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          collectionCopies: ObjectId(req.body.copyObjIDNumber),
        },
      }
    );
    await CollectionCopy.findOneAndUpdate(
      { _id: req.body.copyObjIDNumber },
      { active: false }
    );
    res.redirect(`/yellow/books/view/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/yellow/books/view/${req.params.id}`);
  }
});

router.post("/view/:id/editcollectioncopy", async function (req, res, next) {
  try {
    await CollectionCopy.findOneAndUpdate(
      { _id: req.body.copyObjIDNumber },
      {
        description: req.body.description,
      }
    );
    res.redirect(`/yellow/books/view/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/yellow/books/view/${req.params.id}`);
  }
});

// Add Routes
router.get("/add", async function (req, res, next) {
  try {
    let buildingsAll = await Building.find({ active: true });
    let buildingSectionsAll = await BuildingSection.find({ active: true });
    if (req.query.ouch == "error") {
      res.render("yellow/booksRouter/newBook", {
        ouch: "error",
        buildings: buildingsAll,
        buildingSections: buildingSectionsAll,
        book: "",
      });
    } else {
      res.render("yellow/booksRouter/newBook", {
        buildings: buildingsAll,
        buildingSections: buildingSectionsAll,
        book: "",
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/yellow/books");
  }
});

router.post("/add", async function (req, res, next) {
  try {
    let bookNew = new Book({
      bookIDNumber: req.body.bookIDNumber,
      title: req.body.title,
      author: req.body.author,
      publicationType: req.body.publicationType,
      publisher: req.body.publisher,
      edition: req.body.edition,
      ISBN: req.body.ISBN,
      yearPublished: req.body.yearPublished,
      language: req.body.language,
      cover: req.body.cover,
      description: req.body.description,
      location: {
        building: req.body.building,
        buildingSection: req.body.buildingSection,
      },
      active: true,
    });
    await bookNew.save();
    res.redirect("/yellow/books");
  } catch (err) {
    console.log(err);
    res.redirect("/yellow/books/add?ouch=1");
  }
});

// Delete Routes
router.get("/delete/:id", async function (req, res, next) {
  try {
    await Book.findOneAndUpdate({ _id: req.params.id }, { active: false });
    return res.redirect("/yellow/books");
  } catch (err) {
    res.send(err);
  }
});

// Edit Routes
router.get("/edit/:id", async function (req, res, next) {
  try {
    let buildingsAll = await Building.find({ active: true });
    let buildingSectionsAll = await BuildingSection.find({ active: true });
    let booksThis = await Book.find({ _id: req.params.id }).populate(
      "location.buildingSection location.building"
    );
    console.log(booksThis);
    res.render("yellow/booksRouter/editBook", {
      bookIdNumber: booksThis[0].bookIDNumber,
      book: booksThis[0],
      buildings: buildingsAll,
      buildingSections: buildingSectionsAll,
    });
  } catch (err) {
    res.send(err);
  }
});

router.post("/edit/:id", async function (req, res, next) {
  try {
    await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        author: req.body.author,
        publicationType: req.body.publicationType,
        publisher: req.body.publisher,
        edition: req.body.edition,
        ISBN: req.body.ISBN,
        yearPublished: req.body.yearPublished,
        language: req.body.language,
        cover: req.body.cover,
        description: req.body.description,
        location: {
          building: req.body.building,
          buildingSection: req.body.buildingSection,
        },
      }
    );
    res.redirect("/yellow/books/");
  } catch (err) {
    console.log(err);
    res.redirect("/yellow/books/add?ouch=1");
  }
});

// Search Routes

router.post("/search", async function (req, res, next) {
  try {
    let bookQuery = req.body.searchInput;
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

    let booksThese = await Book.find({
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
    res.render("yellow/booksRouter/index", { books: booksThese });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
