const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.navigation.mustache');

const navigationComponent = function () {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    _this.navigationLinks = [
      {
        linkAddress: 'index.html',
        linkName: 'Home'
      },
      {
        linkAddress: 'details.html',
        linkName: 'Details'
      },
      {
        linkAddress: 'registry.html',
        linkName: 'Registry'
      },
      {
        linkAddress: 'photos.html',
        linkName: 'Photos'
      }
    ];

    fs.readFile(templatePath, 'utf-8', (err, template) => {
      mustache.parse(template, ['<%', '%>']);
      const rendered = mustache.render(template, _this);
      cb(err, rendered);
    });
  };

  /**
   *
   * @param isOverlay
   * @returns {navigationComponent}
   */
  this.setIsOverlay = isOverlay => {
    this.isOverlay = isOverlay;
    return this;
  };

  /**
   *
   * @returns {bool}
   */
  this.isOverlay = () => {
    return this.isOverlay;
  }
};

module.exports = navigationComponent;
