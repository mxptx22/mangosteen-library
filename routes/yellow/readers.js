var express = require("express");
var router = express.Router();
const Reader = require("../../models/Reader");
const Loan = require("../../models/Loan");
var _ = require("lodash");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let readersAll = await Reader.find({ active: true });
    res.render("yellow/readersRouter/index", { readers: readersAll });
  } catch (err) {
    res.send(err);
  }
});

// View Routes
router.get("/view/:id", async function (req, res, next) {
  try {
    let readersThis = await Reader.find({ _id: req.params.id });
    let relevantLoans = await Loan.find({
      reader: req.params.id,
      isLoaned: true,
    }).populate("book collectionCopy");
    console.log(relevantLoans);
    res.render("yellow/readersRouter/viewReader", {
      reader: readersThis[0],
      relevantLoans: relevantLoans,
    });
  } catch (err) {
    res.send(err);
  }
});

const firstNames = [
  "Annalisa",
  "Cooper",
  "Joe",
  "River",
  "Victoria",
  "Marc",
  "Hugo",
  "Anna",
  "Michelle",
  "Kaili",
  "Judith",
  "Hailie",
  "Christine",
  "Maya",
  "Sophia",
  "Bryce",
  "Oliver",
  "Craig",
  "Philip",
];

const lastNames = [
  "Lee",
  "Colwell",
  "Ford",
  "Moffett",
  "Orlando",
  "Butterfield",
  "Wilbur",
  "Willoughby",
  "Everett",
  "Schaffer",
  "Durand",
  "Lunsford",
  "Jensen",
  "Sexton",
  "Haskins",
  "Westmore",
  "Griffin",
  "Carter",
  "Milton",
  "Russell",
];

const emailAddresses = {
  start: [
    "mymail",
    "personal",
    "contactme",
    "iuseemail",
    "willnotrespond",
    "myinbox",
    "contactmenot",
    "sample",
    "myaddress",
  ],
  provider: [
    "@thisinbox",
    "@somemail",
    "@inboxing",
    "@examplemail",
    "@exampleaddress",
    "@mailprov",
    "@thismail",
  ],
  domain: [".web", ".example", ".qu", ".qw", ".zz"],
};

const addressLines = {
  name: [
    "Main",
    "East",
    "Lancaster",
    "Riverside",
    "Portland",
    "Lilac",
    "Carlton",
    "Gainsborough",
    "Ruskin",
    "Woodlands",
    "Meadow",
    "Wisteria",
    "Woodside",
    "John",
    "Thomas",
    "Mill",
  ],
  type: ["Lane", "Road", "Street", "Avenue", "Crescent", "Gardens"],
};

// Add Routes
router.get("/add", function (req, res, next) {
  try {
    if (req.query.ouch == "error") {
      res.render("yellow/readersRouter/newReader", {
        reader: "",
        ouch: "error",
      });
    } else {
      res.render("yellow/readersRouter/newReader", { reader: "" });
    }
  } catch (err) {
    res.send(err);
  }
});

router.post("/add", async function (req, res, next) {
  try {
    let readerNew = new Reader({
      readerIDNumber: req.body.readerIDNumber,
      firstName: _.sample(firstNames),
      surName: _.sample(lastNames),
      phoneNumber: _.random(3333333333, 6666666666),
      emailAddress:
        _.sample(emailAddresses.start) +
        _.sample(emailAddresses.provider) +
        _.sample(emailAddresses.domain),
      address1: `${_.random(1, 44)} ${_.sample(addressLines.name)} ${_.sample(
        addressLines.type
      )}`,
      address2: "",
      addressPostcode: req.body.addressPostcode,
      addressCity: req.body.addressCity,
      localResidence: req.body.localResidence,
      educationStatus: req.body.educationStatus,
      active: true,
    });
    await readerNew.save();
    res.redirect("/yellow/readers");
  } catch (err) {
    res.redirect("/yellow/readers/add?ouch=1");
  }
});

// Delete Routes
router.get("/delete/:id", async function (req, res, next) {
  try {
    await Reader.findOneAndUpdate({ _id: req.params.id }, { active: false });
    return res.redirect("/yellow/readers");
  } catch (err) {
    res.send(err);
  }
});

// Edit Routes
router.get("/edit/:id", async function (req, res, next) {
  try {
    let readersThis = await Reader.find({ _id: req.params.id });
    res.render("yellow/readersRouter/editReader", {
      readerIdNumber: readersThis[0].readerIDNumber,
      reader: readersThis[0],
    });
  } catch (err) {
    res.send(err);
  }
});

router.post("/edit/:id", async function (req, res, next) {
  try {
    await Reader.findOneAndUpdate(
      { _id: req.params.id },
      {
        readerIDNumber: req.body.readerIDNumber,
        firstName: _.sample(firstNames),
        surName: _.sample(lastNames),
        phoneNumber: _.random(3333333333, 6666666666),
        emailAddress:
          _.sample(emailAddresses.start) +
          _.sample(emailAddresses.provider) +
          _.sample(emailAddresses.domain),
        address1: `${_.random(1, 44)} ${_.sample(addressLines.name)} ${_.sample(
          addressLines.type
        )}`,
        address2: "",
        addressPostcode: req.body.addressPostcode,
        addressCity: req.body.addressCity,
        localResidence: req.body.localResidence,
        educationStatus: req.body.educationStatus,
        active: true,
      }
    );
    res.redirect("/yellow/readers/");
  } catch (err) {
    res.redirect("/yellow/readers/add?ouch=1");
  }
});

//  Search Routes

router.post("/search", async function (req, res, next) {
  try {
    let readerQuery = req.body.searchInput;
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
    res.render("yellow/readersRouter/index", { readers: readersThese });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
