"use strict";

const accounts = require("../controllers/accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const stats = require("../utils/memberStats");

const analytics =
    {
        calculateBMI(user, weight)
        {
            logger.info("weight= " +weight);
            logger.info("height= " +user.height);
            if (user.height <= 0)
                return 0;
            else
                return ((weight / (user.height * user.height)))

        },

        generateMemberStats(request)
        {
            logger.info("analytics rendering");
            const loggedInUser = accounts.getCurrentUser(request);
            const assessments = [assessmentStore.getUserAssessments(loggedInUser.id)];
            let weightForAnalytics = loggedInUser.startingWeight;
            let assessmentsLength = assessments.length;
                if (assessmentsLength > 0)
                    {
                        let weightForAnalytics = assessments[assessmentsLength-1].weight;
                        logger.info("weight for analytics = " + weightForAnalytics);
                    }

                stats.bmi = Math.round(analytics.calculateBMI(loggedInUser, weightForAnalytics));
                logger.info("bmi = " + stats.bmi);
                stats.bmiCategory = analytics.determineBMICategory(stats.bmi);
                logger.info("BMI Category = " + stats.bmiCategory);
                stats.isIdealBodyWeight = analytics.isIdealBodyWeight(loggedInUser, weightForAnalytics);
                logger.info("is Ideal Body Weight = " + stats.isIdealBodyWeight);
                stats.trend = true;
                    //if (assessments.length >1);
                        {
                           // stats.trend = assessments[assessmentsLength-2].weight > assessments[assessmentsLength-1].weight;
                            //logger.info("last weight for trend calc: " + assessments[assessments.length-1].weight);
                            //logger.info("2nd last weight for trend calc: " + assessments[assessments.length-2].weight);
                        }
                    logger.info("trend = " + stats.trend);

            return (stats.bmiCategory, stats.isIdealBodyWeight, stats.bmi, stats.trend);
        },

        determineBMICategory(bmi)
        {
            if (bmi<16)
                {
                    return "Severely Underweight"

                }
            else if (16 <=bmi && bmi<=18.4)
                {
                    return "Underweight"
                }
            else if (18.5<=bmi && bmi< 25)
                {
                    return "Normal"
                }
            else if (25<=bmi && bmi< 30)
                {
                  return "Overweight"
                }
            else if (30<=bmi && bmi< 35)
                {
                    return "Moderately Obese"
                }
            else if (35<=bmi && bmi< 40)
                {
                    return "Severely Obese"
                }
            else if (bmi> 40)
                {
                    return "Very Severely Obese"
                }

        },

        isIdealBodyWeight(user, weight)
        {
            const heightInInches = user.height * 39.37;
            const idealBodyWeight = "";
            if (heightInInches<= 60)
                {
                    if(user.gender === "M")
                        {
                            const idealBodyWeight = 50;
                            logger.info(" ideal body weight calc 1 = " + idealBodyWeight);
                        }
                    else
                        {
                            const idealBodyWeight = 45.5;
                            logger.info(" ideal body weight calc 2 = " + idealBodyWeight);
                        }

                }
            else
                {
                    if(user.gender === "M")
                        {
                           const idealBodyWeight = 50 + ((heightInInches - 60) * 2.3);
                            logger.info(" ideal body weight calc 3 = " + idealBodyWeight);

                        }
                    else
                        {
                          const idealBodyWeight = 45.5 + ((heightInInches - 60) * 2.3);
                            logger.info(" ideal body weight calc 4 = " + idealBodyWeight);
                        }


                }

            return ((idealBodyWeight <= (weight + 2.0))
                && (idealBodyWeight >= (weight - 2.0)))

        }


    };

module.exports = analytics;