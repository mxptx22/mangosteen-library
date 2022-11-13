var express = require("express");
var router = express.Router();
const Loan = require("../../models/Loan");

// additional routes
var configRouter = require("./config");
var booksRouter = require("./books");
var readersRouter = require("./readers");
var counterRouter = require("./counter");
var apiRouter = require("./api");
const jwt = require("jsonwebtoken");

router.use(async (req, res, next) => {
  try {
    if (req.cookies.mangoTOKEN == undefined) {
      res.redirect("/");
    }
    if (req.cookies.mangoTOKEN !== undefined) {
      try {
        const verification = jwt.verify(
          req.cookies.mangoTOKEN,
          process.env.TOKEN_SECRET
        );
        if (verification.permission == "yellow") {
          console.log("okay");
        } else {
          res.redirect("/");
        }
      } catch (err) {
        console.log(err);
        res.redirect("/");
      }
    }
    next();
  } catch (err) {
    res.send(err);
  }
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let today = new Date();
    let loansMostRecent = await Loan.find({ active: true })
      .populate("reader book collectionCopy")
      .sort({ dateIssued: -1 })
      .limit(1);
    let loansOverdue = await Loan.find({
      active: true,
      isLoaned: true,
      dateToReturn: { $lte: today },
    }).populate("reader book collectionCopy");
    console.log(loansOverdue);
    console.log(loansMostRecent);
    res.render("yellow/index", {
      title: "Home",
      loansMostRecentOutput: loansMostRecent,
      loansOverdueOutput: loansOverdue,
    });
  } catch (err) {
    try {
      res.render("yellow/index", {
        title: "Home",
        loansMostRecentOutput: null,
        loansOverdueOutput: null,
      });
    } catch (err) {
      res.send(err);
    }
  }
});

// additional routes continue
router.use("/config", configRouter);
router.use("/books", booksRouter);
router.use("/readers", readersRouter);
router.use("/counter", counterRouter);
router.use("/api", apiRouter);

module.exports = router;
