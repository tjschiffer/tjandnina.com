const path = require('path');
const fs = require('fs');
const async = require('async');
const mustache = require('mustache');
const styleTagComponent = new (require('../style-tag-component/style-tag-component'))();

const navigationLanguageChooserComponent = new (require(path.join(__dirname, '../navigation-language-chooser-component/navigation-language-chooser-component.js')))();

const templatePath = path.join(__dirname, './tpl.navigation.mustache');

const navigationComponent = function () {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    styleTagComponent.setStylesheetPath('/css/navigation.css');
    async.parallel({
      styleTag: cb => {
        styleTagComponent.render((err, renderedTemplate) => {
          cb(err, renderedTemplate);
        });
      },
      navigationLanguageChooser: cb => {
        navigationLanguageChooserComponent.render(cb);
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

  this.navigationLinks = () => {
    const navigationLinks = [
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
      },
      {
        linkAddress: 'rsvp.html',
        linkName: 'RSVP'
      }
    ];
    const _this = this;
    return navigationLinks.map(link => {
      if (link.linkName === _this.activeLink) {
        link.isActive = true;
      }
      return link;
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

  this.setActiveLink = activeLink => {
    this.activeLink = activeLink;
    return this;
  }
};

module.exports = navigationComponent;
