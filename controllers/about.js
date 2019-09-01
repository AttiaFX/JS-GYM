"use strict";

const logger = require("../utils/logger");

const about = {
  index(request, response) {
    logger.info("Rendering About");
    const viewData = {
      title: "About JS GYM Application"
    };
    response.render("about", viewData);
  }
};

module.exports = about;