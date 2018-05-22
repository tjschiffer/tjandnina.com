const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.language-chooser.mustache');

const languageChooserComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const view = {
      languages: [
        {
          languageLandingPageUrl: 'fr/index.html',
          flagPath: '/img/franceflag.svg',
          languageMessage: 'Je parle français.'
        },
        {
          languageLandingPageUrl: 'en/index.html',
          flagPath: '/img/americaflag.svg',
          languageMessage: '<div>I took Spanish</div><div>in High School.</div>'
        }
      ]
    };
    fs.readFile(templatePath, 'utf-8', (err, template) => {
      mustache.parse(template, ['<%', '%>']);
      const rendered = mustache.render(template, view);
      cb(err, rendered);
    });
  }
};

module.exports = languageChooserComponent;
