var express = require("express");
var router = express.Router();
const Building = require("../../models/Building");
const BuildingSection = require("../../models/BuildingSection");

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.redirect("/yellow/config/sections");
  } catch (err) {
    res.send(err);
  }
});

// Config Library Sections
router.get("/sections", async function (req, res, next) {
  try {
    let buildingsAll = await Building.find({ active: true });
    let buildingSectionsAll = await BuildingSection.find({ active: true });
    res.render("yellow/configRouter/sections.ejs", {
      sections: buildingSectionsAll,
      buildings: buildingsAll,
    });
  } catch (err) {
    res.send(err);
  }
});

router.post("/sections/addbuilding", async function (req, res, next) {
  try {
    let buildingNew = new Building({
      name: req.body.name,
      active: true,
    });
    let createdBuilding = await buildingNew.save();
    return res.redirect("/yellow/config/sections");
  } catch (err) {
    res.send(err);
  }
});

router.post("/sections/editbuilding", async function (req, res, next) {
  try {
    await Building.findOneAndUpdate(
      { _id: req.body.id },
      { name: req.body.name }
    );
    return res.redirect("/yellow/config/sections");
  } catch (err) {
    res.send(err);
  }
});

router.get("/sections/deletebuilding/:id", async function (req, res, next) {
  try {
    await Building.findOneAndUpdate({ _id: req.params.id }, { active: false });
    return res.redirect("/yellow/config/sections");
  } catch (err) {
    res.send(err);
  }
});

router.post("/sections/addbuildingsection", async function (req, res, next) {
  try {
    let buildingSectionNew = new BuildingSection({
      name: req.body.name,
      active: true,
    });
    let createdBuildingSection = await buildingSectionNew.save();
    return res.redirect("/yellow/config/sections");
  } catch (err) {
    res.send(err);
  }
});

router.post("/sections/editbuildingsection", async function (req, res, next) {
  try {
    await BuildingSection.findOneAndUpdate(
      { _id: req.body.id },
      { name: req.body.name }
    );
    return res.redirect("/yellow/config/sections");
  } catch (err) {
    console.log(err);
  }
});

router.get(
  "/sections/deletebuildingsection/:id",
  async function (req, res, next) {
    try {
      await BuildingSection.findOneAndUpdate(
        { _id: req.params.id },
        { active: false }
      );
      return res.redirect("/yellow/config/sections");
    } catch (err) {
      res.send(err);
    }
  }
);

// Config About
router.get("/about", function (req, res, next) {
  try {
    res.render("yellow/configRouter/about.ejs");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
