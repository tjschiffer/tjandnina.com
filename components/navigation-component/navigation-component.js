const path = require('path');
const fs = require('fs');
const mustache = require('mustache');
const async = require('async');

const navigationLanguageChooser = new (require(path.join(__dirname, '../navigation-language-chooser-component/navigation-language-chooser-component.js')))();

const templatePath = path.join(__dirname, './tpl.navigation.mustache');

const navigationComponent = function () {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    async.parallel({
      navigationLanguageChooser: cb => {
        navigationLanguageChooser.render(cb);
      }
    }, (err, view) => {
      if (err) {
        cb(err)
      }
      view = Object.assign(view, _this);

      fs.readFile(templatePath, 'utf-8', (err, template) => {
        mustache.parse(template, ['<%', '%>']);
        const rendered = mustache.render(template, view);
        cb(err, rendered);
      });
    });
  };

  this.navigationLinks = [
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

  /**
   *
   * @param isOverlay
   * @returns {navigationComponent}
   */
  this.setIsOverlay = isOverlay => {
    this.isOverlay = isOverlay;
    return this;
  };
};

module.exports = navigationComponent;
