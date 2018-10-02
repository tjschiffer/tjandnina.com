const path = require('path');
const fs = require('fs');
const async = require('async');
const mustache = require('mustache');
const styleTagComponent = new (require('../style-tag-component/style-tag-component'))();

const templatePath = path.join(__dirname, './tpl.navigation-language-chooser.mustache');

const navigationLanguageChooserComponent = function () {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _view = {
      languages: [
        {
          url: '/fr',
          flagPath: '/img/franceflag.svg'
        },
        {
          url: '/en',
          flagPath: '/img/americaflag.svg'
        }
      ]
    };

    styleTagComponent.setStylesheetPath('/css/navigation-language-chooser.css');
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
        view = Object.assign(view, _view);

        fs.readFile(templatePath, 'utf-8', (err, template) => {
          mustache.parse(template, ['<%', '%>']);
          const rendered = mustache.render(template, view);
          cb(err, rendered);
        });
      }
    );
  };
};

module.exports = navigationLanguageChooserComponent;
