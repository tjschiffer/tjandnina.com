const path = require('path');
const fs = require('fs');
const async = require('async');
const mustache = require('mustache');
const styleTagComponent = new (require('../style-tag-component/style-tag-component'))();

const templatePath = path.join(__dirname, './tpl.hero-image.mustache');

const heroImageComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    styleTagComponent.setStylesheetPath('/css/hero-image.css');
    async.parallel({
      styleTag: cb => {
        styleTagComponent.render((err, renderedTemplate) => {
          cb(err, renderedTemplate);
        });
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
};

module.exports = heroImageComponent;
