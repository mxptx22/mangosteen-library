var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* GET users listing. */
try {
  router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });
} catch (err) {
  res.send(err);
}

// Register Yellow User -- this is for maintenance only...
// router.post("/registerYellow", async function (req, res, next) {
//   // hash password
//   const salt = await bcrypt.genSalt(10);
//   const passwordHashed = await bcrypt.hash(req.body.password, salt);
//   // createuser
//   try {
//     const userNew = new User({
//       username: req.body.username,
//       password: passwordHashed,
//       type: "yellow",
//       active: true,
//     });
//     let createdUser = await userNew.save();
//     res.send(`User ${userNew.username} created successfully.`);
//   } catch (err) {
//     console.log(err);
//     res.send(`User creation failed.`);
//   }
// });

// Login User
router.post("/login", async function (req, res, next) {
  try {
    const checkUsername = await User.findOne({
      username: req.body.usernameInput,
    });
    if (!checkUsername) {
      res.redirect("/?ouch=1");
    }
    if (checkUsername) {
      const validPassword = await bcrypt.compare(
        req.body.passwordInput,
        checkUsername.password
      );
      if (!validPassword) {
        res.redirect("/?ouch=1");
      }
      if (validPassword) {
        const token = jwt.sign(
          { _id: checkUsername["_id"], permission: checkUsername["type"] },
          process.env.TOKEN_SECRET
        );
        if (checkUsername["type"] === "yellow") {
          res.cookie("mangoTOKEN", token).redirect("/yellow");
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.send("An error occurred.");
  }
});

router.get("/logout", async function (req, res, next) {
  try {
    res.clearCookie("mangoTOKEN").redirect("/?ouch=2");
  } catch (err) {
    res.send(
      "An error occurred while logging out. Please verify your login status."
    );
  }
});

module.exports = router;
