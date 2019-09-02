"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const trainerDashboard = require("./controllers/trainerDashboard.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/settings", accounts.settings);
router.post("/updatesettings", accounts.updateSettings);

router.get("/dashboard", dashboard.index);
router.get("/dashboard/deleteassessment/:id", dashboard.deleteAssessment);
router.post("/dashboard/addassessment", dashboard.addAssessment);

router.get("/trainer-dash", trainerDashboard.index);
router.get("/trainerdashboard/trainerassessment/:id", trainerDashboard.trainerAssessment);

router.get("/about", about.index);
router.get("/assessmentStore/:id", dashboard.index);

module.exports = router;
