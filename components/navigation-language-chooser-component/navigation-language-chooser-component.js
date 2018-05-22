const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.navigation-language-chooser.mustache');

const navigationLanguageChooserComponent = function () {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const view = {
      languages: [
        {
          url: '/fr/{{ templateOutput }}',
          flagPath: '/img/franceflag.svg'
        },
        {
          url: '/en/{{ templateOutput }}',
          flagPath: '/img/americaflag.svg'
        }
      ]
    };

    fs.readFile(templatePath, 'utf-8', (err, template) => {
      mustache.parse(template, ['<%', '%>']);
      const rendered = mustache.render(template, view);
      cb(err, rendered);
    });
  };
};

module.exports = navigationLanguageChooserComponent;
