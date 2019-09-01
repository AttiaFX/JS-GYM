"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const analytics = require("../utils/analytics");
const uuid = require("uuid");
const memberStats = require("../utils/memberStats");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const userEmail = request.cookies.email;
    const viewData = {
      title: "Member Assessment Dashboard",
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
      member: userStore.getUserById(loggedInUser.id),
      analytics: analytics.generateMemberStats(request),
      bmi: memberStats.bmi,
      bmiCategory: memberStats.bmiCategory,
      idealBodyWeight: memberStats.isIdealBodyWeight,
      trend: memberStats.trend

    };
    logger.info("about to render", assessmentStore.getUserAssessments(loggedInUser));
    response.render("dashboard", viewData);
  },

  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect("/dashboard");
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newAssessment =
        {
        id: uuid(),
        userid: loggedInUser.id,
        weight: request.body.weight,
        chest: request.body.chest,
        upperarm: request.body.upperarm,
        thigh: request.body.thigh,
        waist: request.body.waist,
        hips: request.body.hips,
        date: new Date()
        };
    logger.debug("Creating a new Assessment", newAssessment);
    assessmentStore.addAssessment(newAssessment);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
