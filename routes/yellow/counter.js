var express = require("express");
var router = express.Router();
const Reader = require("../../models/Reader");
const Book = require("../../models/Book");
const Loan = require("../../models/Loan");
const CollectionCopy = require("../../models/CollectionCopy");
const { request } = require("express");

// Preclusion Middleware

const checkPreclusion = async (req, res, next) => {
  try {
    let relevantLoans = await Loan.find({
      isLoaned: true,
      active: true,
      collectionCopy: req.params.copyObjId,
    });
    if (relevantLoans.length > 0) {
      throw new Error("This entry is already on loan.");
    } else {
      next();
    }
  } catch (err) {
    res.redirect("/yellow/counter/loans?ouch=1");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.render("yellow/counterRouter/index");
  } catch (err) {
    res.send(err);
  }
});

// Loans

// Get All Loans
router.get("/loans", async function (req, res, next) {
  try {
    let loansOnLoan = await Loan.find({
      isLoaned: true,
      active: true,
    }).populate("reader book collectionCopy");
    let loansReturned = await Loan.find({
      isLoaned: false,
      active: true,
    }).populate("reader book collectionCopy");

    if (req.query.ouch == "1") {
      res.render("yellow/counterRouter/allLoans", {
        loansOnLoan: loansOnLoan,
        loansReturned: loansReturned,
        ouch: "1",
      });
    } else {
      res.render("yellow/counterRouter/allLoans", {
        loansOnLoan: loansOnLoan,
        loansReturned: loansReturned,
      });
    }
  } catch (err) {
    res.send(err);
  }
});

// Get All Loans Currently Active
router.get("/loans/onloan", async function (req, res, next) {
  try {
    let loansOnLoan = await Loan.find({
      isLoaned: true,
      active: true,
    }).populate("reader book collectionCopy");
    res.render("yellow/counterRouter/allLoansOnLoan", {
      loansOnLoan: loansOnLoan,
    });
  } catch (err) {
    res.send(err);
  }
});

// Get All Loans Overdue
router.get("/loans/overdue", async function (req, res, next) {
  try {
    let today = new Date();
    let loansOnLoan = await Loan.find({
      isLoaned: true,
      active: true,
      dateToReturn: { $lt: today },
    }).populate("reader book collectionCopy");
    res.render("yellow/counterRouter/allLoansOverdue", {
      loansOnLoan: loansOnLoan,
    });
  } catch (err) {
    res.send(err);
  }
});

//Add New Loan Routes
router.get("/loans/new", function (req, res, next) {
  try {
    res.render("yellow/counterRouter/newLoan");
  } catch (err) {
    res.send(err);
  }
});

router.get(
  "/loans/new/next/:readerObjId/:copyObjId",
  checkPreclusion,
  async function (req, res, next) {
    try {
      let readersThis = await Reader.findOne({ _id: req.params.readerObjId });
      let copiesThis = await CollectionCopy.findOne({
        _id: req.params.copyObjId,
      });
      let booksThis = await Book.findOne({
        collectionCopies: req.params.copyObjId,
      });
      res.render("yellow/counterRouter/newLoanContinued", {
        copy: copiesThis,
        book: booksThis,
        reader: readersThis,
      });
    } catch (err) {
      res.redirect("/yellow/counter/loans/new?ouch=1");
      console.log(err);
    }
  }
);

router.post("/loans/new", async function (req, res, next) {
  try {
    let loanNew = new Loan({
      dateIssued: new Date(),
      dateToReturn: req.body.dateToReturn,
      isLoaned: true,
      reader: req.body.readerObjId,
      book: req.body.bookObjId,
      collectionCopy: req.body.collectionCopyObjId,
      active: true,
    });
    await loanNew.save();
    res.redirect("/yellow/counter/loans");
  } catch (err) {
    console.log(err);
    res.redirect("/yellow/counter/loans/new?ouch=1");
  }
});

// Return Book from Loan Routes
router.get("/loans/return/:id", async function (req, res, next) {
  try {
    await Loan.findOneAndUpdate(
      { _id: req.params.id },
      { isLoaned: false, dateReturned: new Date() }
    );
    res.redirect("/yellow/counter/loans");
  } catch (err) {
    res.send(err);
  }
});

// Cancel Return Book from Loan Routes
router.get(
  "/loans/revertreturn/:id/:copyObjId",
  checkPreclusion,
  async function (req, res, next) {
    try {
      await Loan.findOneAndUpdate(
        { _id: req.params.id },
        { isLoaned: true, dateReturned: null }
      );
      res.redirect("/yellow/counter/loans");
    } catch (err) {
      res.send(err);
    }
  }
);

// Search Loans Routes
router.post("/loans/search", async function (req, res, next) {
  try {
    let loanQuery = req.body.searchInput;
    const regexPattern = new RegExp(loanQuery, "i");

    let loanQueryNumber = null;
    if (Number(loanQuery)) {
      loanQueryNumber = loanQuery;
    }

    let loansOnLoan = await Loan.find({
      isLoaned: true,
      active: true,
    }).populate("reader book collectionCopy");

    let searchedLoansOnLoan = await loansOnLoan.filter((el) => {
      return (
        el.reader.firstName.match(regexPattern) ||
        el.reader.surName.match(regexPattern) ||
        el.reader.readerIDNumber == loanQueryNumber ||
        el.book.title.match(regexPattern) ||
        el.book.author.match(regexPattern) ||
        el.collectionCopy[0].copyIDNumber == loanQueryNumber ||
        el.book.bookIDNumber == loanQueryNumber
      );
    });

    let loansReturned = await Loan.find({
      isLoaned: false,
      active: true,
    }).populate("reader book collectionCopy");

    let searchedLoansReturned = await loansReturned.filter((el) => {
      return (
        el.reader.firstName.match(regexPattern) ||
        el.reader.surName.match(regexPattern) ||
        el.reader.readerIDNumber == loanQueryNumber ||
        el.book.title.match(regexPattern) ||
        el.book.author.match(regexPattern) ||
        el.collectionCopy[0].copyIDNumber == loanQueryNumber ||
        el.book.bookIDNumber == loanQueryNumber
      );
    });

    res.render("yellow/counterRouter/allLoansSearched", {
      loansOnLoan: searchedLoansOnLoan,
      loansReturned: searchedLoansReturned,
    });
  } catch (err) {
    res.send(err);
  }
});

// Prolong Routes

router.get("/loans/prolong/:id", async function (req, res, next) {
  try {
    let loanThis = await Loan.findOne({ _id: req.params.id }).populate(
      "reader book collectionCopy"
    );
    if (loanThis.isLoaned == true) {
      // let initialReturnDate = loanThis.dateToReturn
      res.render("yellow/counterRouter/prolongLoan", {
        loanObjId: loanThis._id,
        initialReturnDate: loanThis.dateToReturn,
        initialIssueDate: loanThis.dateIssued,
        copy: loanThis.collectionCopy[0],
        book: loanThis.book,
        reader: loanThis.reader,
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    res.redirect("/yellow/counter/loans?ouch=1");
    console.log(err);
  }
});

router.post("/loans/prolong", async function (req, res, next) {
  try {
    await Loan.findOneAndUpdate(
      { _id: req.body.loanObjId },
      {
        isLoaned: true,
        dateReturned: null,
        dateToReturn: req.body.dateToReturn,
      }
    );
    res.redirect("/yellow/counter/loans");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
