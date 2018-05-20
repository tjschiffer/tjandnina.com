const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, './tpl.hero-image.mustache');

const heroImageComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    fs.readFile(templatePath, 'utf-8', (err, html) => {
      cb(err, html);
    });
  };
};

module.exports = heroImageComponent;
