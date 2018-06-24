const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.head.mustache');

const headComponent = function() {

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
  this.setTitle = title => {
    this.title = title;
    return this;
  };

  /**
   *
   * @returns {string}
   */
  this.getTitle = () => {
    return this.title || 'T.J. & Nina';
  };

  /**
   * Bump the static tag on every build
   *
   * @returns {string}
   */
  this.getStaticTag = () => {
    return (new Date()).getTime().toString();
  };

  /**
   *
   * @returns {boolean}
   */
  this.isProduction = () => {
    return process.env.NODE_ENV === 'production';
  }
};

module.exports = headComponent;
