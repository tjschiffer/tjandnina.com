const mustache = require('mustache');
const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, './tpl.photos.mustache');

const photosComponent = function() {

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
   * @returns {Array}
   */
  this.getPhotosColumns = () => {
    return [
      Array.from(Array(2).keys()).map(i => '/img/tjandnina/' + (i + 1).toString() + '.jpg'),
      Array.from(Array(4).keys()).map(i => '/img/tjandnina/' + (i + 3).toString() + '.jpg'),
      Array.from(Array(4).keys()).map(i => '/img/tjandnina/' + (i + 7).toString() + '.jpg')
    ];
  }

};

module.exports = photosComponent;
