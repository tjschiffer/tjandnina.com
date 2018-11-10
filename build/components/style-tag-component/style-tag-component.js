const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.style-tag.mustache');

const styleTagComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    fs.readFile(templatePath, 'utf-8', (err, template) => {
      mustache.parse(template, ['<%', '%>']);
      const rendered = mustache.render(template, _this);
      cb(err, rendered);
    });
  };

  /**
   *
   * @param title
   * @returns {headComponent}
   */
  this.setStylesheetPath = title => {
    this.stylesheetPath = title;
    return this;
  };

  /**
   *
   * @returns {string}
   */
  this.getStylesheetPath = () => {
    return this.stylesheetPath || '';
  };

  /**
   * Bump the static tag on every build
   *
   * @returns {string}
   */
  this.getStaticTag = () => {
    return (new Date()).getTime().toString();
  };
};

module.exports = styleTagComponent;
