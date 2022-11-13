var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    if (req.query.ouch == 1) {
      res.render("index", { ouch: 1 });
    }
    if (req.query.ouch == 2) {
      res.render("index", { ouch: 2 });
    } else {
      res.render("index");
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
