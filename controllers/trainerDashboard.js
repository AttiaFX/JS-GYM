"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const uuid = require("uuid");
const analytics = require("../utils/analytics.js");
const memberStats = require("../utils/memberStats");

const trainerDashboard =
{
  index(request, response) {
    logger.info("Trainer dashboard rendering");
    const viewData =
        {
          title: "Trainer Assessment Dashboard",
          assessments: assessmentStore.getAllAssessment(),
          users: userStore.getAllUsers()
        };
    response.render("trainer-dash", viewData);
  },

  trainerAssessment(request, response)
    {
      logger.info("dashboard rendering");
      const chosenMember = userStore.getUserById(request);
      const viewData =
          {
              title: "Chosen Member Assessment Dashboard",
              assessments: assessmentStore.getUserAssessments(chosenMember),
              analytics: analytics.generateMemberStats(request),
              member: chosenMember,
              bmi: memberStats.bmi,
              bmiCategory: memberStats.bmiCategory,
              idealBodyWeight: memberStats.isIdealBodyWeight,
              trend: memberStats.trend
          };
      response.render("trainer-assessment", viewData);
    }
};

module.exports = trainerDashboard;
