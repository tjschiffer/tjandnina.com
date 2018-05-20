const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.navigation.mustache');

const navigationComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const view = {
      navigationLinks: [
        {
          linkAddress: '/index.html',
          linkName: 'Home'
        },
        {
          linkAddress: '/details.html',
          linkName: 'Details'
        },
        {
          linkAddress: '/registry.html',
          linkName: 'Registry'
        },
        {
          linkAddress: '/photos.html',
          linkName: 'Photos'
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

module.exports = navigationComponent;
